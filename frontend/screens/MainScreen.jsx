import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { setFeedbacks } from "../store/feedbackSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import FeedbackModal from "../components/FeedbackModal";
import { Feedback } from "../api/Feedback";
import { Geocode } from "../api/Geocode";
import PrimaryTextInput from "../components/PrimaryTextInput";
import FabButton from "../components/FabButton";
import colors from "../theme/colors";

export default function MainScreen() {
  const dispatch = useDispatch();
  const feedbacks = useSelector((state) => state.feedback.items);
  const user = useSelector((state) => state.user);
  const [postalCode, setPostalCode] = useState("");
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  useEffect(() => {
    Feedback.list()
      .then((data) => dispatch(setFeedbacks(data)))
      .catch((err) => console.error(err));
  }, [dispatch]);

  // Fetch polygon for user's city on mount or when user.cityCoords changes
  useEffect(() => {
    const fetchPolygon = async () => {
      if (user.postalCode) {
        try {
          const data = await Geocode.getCityPolygon(user.postalCode);
          if (Array.isArray(data)) setPolygonCoords(data);
        } catch (e) {
          /* ignore */
        }
      }
    };
    fetchPolygon();
  }, [user.postalCode]);

  const handleGoToHome = () => {
    if (user.cityCoords) {
      mapRef.current?.animateToRegion({
        latitude: user.cityCoords.lat,
        longitude: user.cityCoords.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  };

  const handleGoToCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    let location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  };

  const handleSearchPostalCode = async () => {
    if (!postalCode) return;
    try {
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
        if (Array.isArray(polyData)) setPolygonCoords(polyData);
      } else {
        alert("Code postal non trouvé.");
      }
    } catch (e) {
      alert("Erreur lors de la recherche du code postal.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <PrimaryTextInput
        style={styles.searchBar}
        placeholder="Postal code"
        value={postalCode}
        onChangeText={setPostalCode}
        onSubmitEditing={handleSearchPostalCode}
      />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
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
          >
            <MaterialCommunityIcons
              name="alert"
              size={36}
              color={colors.error}
            />
          </Marker>
        ))}
      </MapView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <FabButton
          style={styles.fab}
          onPress={handleGoToHome}
          iconName="home"
        />
        <FabButton
          style={styles.fab}
          onPress={handleGoToCurrentLocation}
          iconName="crosshairs-gps"
        />
        <FabButton
          style={styles.fab}
          onPress={() => navigation.navigate("MyAccountScreen")}
          iconName="account"
        />
        <FabButton
          style={styles.fab}
          onPress={() => setFeedbackModalVisible(true)}
          iconName="plus"
        />
      </View>
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    elevation: 4,
    borderColor: colors.border,
    borderWidth: 1,
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
