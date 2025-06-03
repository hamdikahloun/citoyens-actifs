import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

  // Fetch polygon for user's city on mount or when user.cityCoords changes
  useEffect(() => {
    const fetchPolygon = async () => {
      if (user.postalCode) {
        try {
          const data = await Geocode.getCityPolygon(user.postalCode);
          if (Array.isArray(data)) {
            setPolygonCoords(data);
          }
        } catch (e) {
          /* ignore */
        }
      }
    };
    fetchPolygon();
  }, [user.postalCode, dispatch]);

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
        // Fetch feedback for user's postal code
        const feedbacks = await Feedback.list(user.postalCode);
        dispatch(setFeedbacks(feedbacks));
      } catch (error) {
        console.error("Error getting polygon:", error);
      }
    }
  };

  const handleGoToCurrentLocation = async () => {
    setLoadingCurrentLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    let location = await Location.getCurrentPositionAsync({});

    // Get polygon coordinates for current location
    try {
      const response = await Geocode.getCoordinatesPolygon(
        location.coords.latitude,
        location.coords.longitude,
      );
      setPolygonCoords(response);

      // Get postal code for current location
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0 && addresses[0].postalCode) {
        // Fetch feedback for current location's postal code
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
        // Fetch and show polygon for searched postal code
        const polyData = await Geocode.getCityPolygon(postalCode);
        if (Array.isArray(polyData)) {
          setPolygonCoords(polyData);
          // Fetch feedback for searched postal code
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

  const handleMarkerPress = (id) => {
    setSelectedFeedback(id);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Code postal"
          value={postalCode}
          keyboardType="numeric"
          onChangeText={setPostalCode}
          style={styles.searchBar}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPostalCode}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Map */}
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

      {/* Floating Action Buttons */}
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
  searchBarContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
  },
  searchBar: {
    fontSize: 16,
    flex: 1,
    padding: 12,
  },
  searchButton: {
    padding: 12,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 24,
    flexDirection: "column",
    alignItems: "center",
  },
  fab: {
    marginBottom: 16,
  },
});
