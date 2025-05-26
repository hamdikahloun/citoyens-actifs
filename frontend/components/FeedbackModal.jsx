import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { Feedback } from "@/api/Feedback";
import { addFeedback } from "@/store/feedbackSlice";
import { useDispatch } from "react-redux";

const FeedbackModal = ({ defaultLocation, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(defaultLocation || null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    checkAndRequestPermissions();
  }, [checkAndRequestPermissions]);

  const checkAndRequestPermissions = useCallback(async () => {
    try {
      // Request camera permissions
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la caméra est nécessaire pour prendre des photos",
          [{ text: "OK" }],
        );
        return;
      }

      // Request media library permissions
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la galerie est nécessaire pour sélectionner des photos",
          [{ text: "OK" }],
        );
        return;
      }

      // Request location permissions
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la localisation est nécessaire",
          [{ text: "OK" }],
        );
        return;
      }

      setPermissionsGranted(true);
      getCurrentLocation();
    } catch (error) {
      console.error("Erreur lors de la demande des permissions:", error);
      Alert.alert("Erreur", "Impossible d'obtenir les permissions nécessaires");
    }
  }, [getCurrentLocation]);

  const getCurrentLocation = useCallback(async () => {
    try {
      let currentLocation = defaultLocation;
      if (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      }

      // Get address from coordinates
      const addresses = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const fullAddress = [
          address.street,
          address.postalCode,
          address.city,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la position:", error);
      Alert.alert("Erreur", "Impossible d'obtenir votre position actuelle");
    }
  }, [defaultLocation]);

  const takePicture = useCallback(async () => {
    if (!permissionsGranted) {
      await checkAndRequestPermissions();
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la prise de photo:", error);
      Alert.alert("Erreur", "Impossible de prendre la photo");
    }
  }, [permissionsGranted, checkAndRequestPermissions]);

  const pickImage = useCallback(async () => {
    if (!permissionsGranted) {
      await checkAndRequestPermissions();
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  }, [permissionsGranted, checkAndRequestPermissions]);

  const showImageOptions = useCallback(() => {
    Alert.alert("Ajouter une photo", "Choisissez une option", [
      {
        text: "Prendre une photo",
        onPress: takePicture,
      },
      {
        text: "Choisir depuis la galerie",
        onPress: pickImage,
      },
      {
        text: "Annuler",
        style: "cancel",
      },
    ]);
  }, [takePicture, pickImage]);

  const handleMapLongPress = useCallback(async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({
      coords: {
        latitude,
        longitude,
        accuracy: 0,
      },
      timestamp: Date.now(),
    });

    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const fullAddress = [
          address.street,
          address.postalCode,
          address.city,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error("Erreur lors de la géocodification:", error);
    }

    setShowMap(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un titre");
      return;
    }
    if (!feedback.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre message");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", feedback.trim());

      if (location) {
        formData.append("lat", location.coords.latitude);
        formData.append("lng", location.coords.longitude);
      }

      if (address) {
        formData.append("address", address);
      }

      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        });
      }
      const newFeedback = await Feedback.create(formData);
      dispatch(addFeedback(newFeedback));

      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      Alert.alert("Erreur", "Impossible d'envoyer le message");
    } finally {
      setLoading(false);
    }
  }, [location, address, image, title, feedback, resetForm, dispatch]);

  const resetForm = useCallback(() => {
    setAddress("");
    setTitle("");
    setFeedback("");
    setImage(null);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (feedback.trim() || image) {
      Alert.alert(
        "Modifications non enregistrées",
        "Vous avez des modifications non enregistrées. Voulez-vous vraiment fermer ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Fermer",
            style: "destructive",
            onPress: () => {
              resetForm();
            },
          },
        ],
      );
    } else {
      onClose();
    }
  }, [feedback, image, onClose, resetForm]);

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Nouveau Signalement</Text>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Titre du signalement"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextInput
            style={styles.input}
            placeholder="Décrivez votre signalement..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />

          <View style={styles.imageContainer}>
            {image ? (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <SecondaryButton
                onPress={showImageOptions}
                disabled={!permissionsGranted}
                style={styles.imageButton}
                text="Ajouter une photo"
              />
            )}
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#666" />
            <TouchableOpacity
              style={styles.addressDisplay}
              onPress={() => setShowMap(true)}
            >
              <Text style={styles.locationText}>
                {address || "Sélectionner un emplacement"}
              </Text>
              <Ionicons name="map" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location?.coords?.latitude || 48.8566,
                  longitude: location?.coords?.longitude || 2.3522,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onLongPress={handleMapLongPress}
              >
                {location && (
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                  />
                )}
              </MapView>
              <Text style={styles.mapInstructions}>
                Appuyez longuement sur la carte pour sélectionner un emplacement
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={handleClose}
              style={styles.button}
              text="Annuler"
            />
            <PrimaryButton
              onPress={handleSubmit}
              disabled={loading || !feedback.trim()}
              style={styles.button}
              text={loading ? "Envoi..." : "Envoyer"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageButton: {
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#007AFF",
  },
  imagePreview: {
    position: "relative",
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  removeImage: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  addressDisplay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  locationText: {
    flex: 1,
    color: "#666",
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    color: "#666",
  },
});

export default FeedbackModal;
