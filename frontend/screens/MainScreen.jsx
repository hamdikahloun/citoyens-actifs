import React, { useEffect, useState, useRef } from "react";
import { Alert, Keyboard, StyleSheet, View } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { setFeedbacks } from "@/reducers/feedbackSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import FeedbackModal from "@/components/FeedbackModal";
import FeedbackDetailsModal from "@/components/FeedbackDetailsModal";
import { Feedback } from "@/api/Feedback";
import { Geocode } from "@/api/Geocode";
import FabButton from "@/components/FabButton";
import colors from "@/theme/colors";
import HomeFab from "@/components/HomeFab";
import MyAccountFab from "@/components/MyAccountFab";
import AddFeedbackFab from "@/components/AddFeedbackFab";
import Search from "@/components/Search";

// écran map *************************************************************************
export default function MainScreen() {
  const dispatch = useDispatch();
  const feedbacks = useSelector((state) => state.feedback.items);
  const user = useSelector((state) => state.user);
  const [postalCode, setPostalCode] = useState("");
  const mapRef = useRef(null);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    Feedback.list(user.postalCode)
      .then((data) => dispatch(setFeedbacks(data)))
      .catch((err) => console.error(err));
  }, [dispatch, user.postalCode]);

  useEffect(() => {
    const fetchPolygon = async () => {
      if (user.postalCode) {
        try {
          const data = await Geocode.getCityPolygon(user.postalCode);
          if (Array.isArray(data)) {
            setPolygonCoords(data);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchPolygon();
  }, [user.postalCode, dispatch]);

  // recentre la carte sur la ville enregistrée en BDD *******************************
  const handleGoToHome = async () => {
    if (user.cityCoords) {
      mapRef.current?.animateToRegion({
        latitude: user.cityCoords.lat,
        longitude: user.cityCoords.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      try {
        const response = await Geocode.getCoordinatesPolygon(
          user.cityCoords.lat,
          user.cityCoords.lng,
        );
        setPolygonCoords(response);
        const feedbacks = await Feedback.list(user.postalCode);
        dispatch(setFeedbacks(feedbacks));
      } catch (error) {
        console.error("Error getting polygon:", error);
      }
    }
  };

  // recentre la carte sur la localisation GPS avec affichage de la ville associée **
  const handleGoToCurrentLocation = async () => {
    setLoadingCurrentLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    let location = await Location.getCurrentPositionAsync({});

    try {
      const response = await Geocode.getCoordinatesPolygon(
        location.coords.latitude,
        location.coords.longitude,
      );
      setPolygonCoords(response);

      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0 && addresses[0].postalCode) {
        const feedbacks = await Feedback.list(addresses[0].postalCode);
        dispatch(setFeedbacks(feedbacks));
      }
    } catch (error) {
      console.error("Error getting polygon:", error);
      Alert.alert("Erreur lors de la récupération des coordonnées");
    }

    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    setLoadingCurrentLocation(false);
  };

  // cherche le code postal entré et affiche la ville associée **********************
  const handleSearchPostalCode = async () => {
    if (!postalCode) return;
    try {
      Keyboard.dismiss();
      const data = await Geocode.search(postalCode);
      if (data.length > 0) {
        mapRef.current?.animateToRegion({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        const polyData = await Geocode.getCityPolygon(postalCode);
        if (Array.isArray(polyData)) {
          setPolygonCoords(polyData);
          const feedbacks = await Feedback.list(postalCode);
          dispatch(setFeedbacks(feedbacks));
        }
        setPostalCode("");
      } else {
        alert("Code postal non trouvé.");
      }
    } catch (e) {
      alert("Erreur lors de la recherche du code postal.");
    }
  };

  // enregistre un signalement à l'endroit sélectionné par un appui long ************
  const handleMapLongPress = (event) => {
    setLocation({
      coords: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        accuracy: 0,
      },
      timestamp: Date.now(),
    });
    setFeedbackModalVisible(true);
  };

  // affiche le signalement sur lequel on click *************************************
  const handleMarkerPress = (id) => {    
    setSelectedFeedback(id);
  };

  return (
    <View style={styles.container}>
      <Search
        value={postalCode}
        onChangeText={setPostalCode}
        onSearch={handleSearchPostalCode}
      />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        onLongPress={handleMapLongPress}
        initialRegion={{
          latitude: user.cityCoords?.lat || 48.8566,
          longitude: user.cityCoords?.lng || 2.3522,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords.map(({ lat, lng }) => ({
              latitude: lat,
              longitude: lng,
            }))}
            fillColor="rgba(37, 91, 117, 0.3)"
            strokeColor={colors.button}
            strokeWidth={2}
          />
        )}
        {feedbacks.map((fb) => (
          <Marker
            key={fb._id}
            coordinate={{
              latitude: fb.location.lat,
              longitude: fb.location.lng,
            }}
            onPress={() => handleMarkerPress(fb._id)}
          >
            <MaterialCommunityIcons
              name="alert"
              size={32}
              color={colors.error}
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.fabContainer}>
        <HomeFab onPress={handleGoToHome} style={styles.fab} />
        <FabButton
          style={styles.fab}
          onPress={handleGoToCurrentLocation}
          iconName="crosshairs-gps"
          isLoading={loadingCurrentLocation}
        />
        <MyAccountFab style={styles.fab} />
        <AddFeedbackFab
          style={styles.fab}
          onPress={() => setFeedbackModalVisible(true)}
        />
      </View>
      {feedbackModalVisible && (
        <FeedbackModal
          defaultLocation={location}
          onClose={() => {
            setLocation(null);
            setFeedbackModalVisible(false);
          }}
        />
      )}

      {selectedFeedback && (
        <FeedbackDetailsModal
          id={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 24,
    flexDirection: "column",
    alignItems: "center",
  },
  fab: {
    marginBottom: 16,
    color: 'red',
  },
});
