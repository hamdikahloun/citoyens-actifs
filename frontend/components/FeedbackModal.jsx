import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { addFeedback } from "../store/feedbackSlice";
import { Feedback } from "../api/Feedback";
import { Geocode } from "../api/Geocode";
import PrimaryTextInput from "./PrimaryTextInput";
import PrimaryButton from "./PrimaryButton";
import colors from "../theme/colors";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function FeedbackModal({ visible, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Nous avons besoin de votre permission pour accéder à vos photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !address) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const data = await Geocode.geocodeAddress(address);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("lat", data.lat);
      formData.append("lng", data.lng);

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

      const feedback = await Feedback.create(formData);
      dispatch(addFeedback(feedback));
      handleClose();
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setAddress("");
    setImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nouveau Signalement</Text>
          <PrimaryTextInput
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.inputPlaceholder}
          />
          <PrimaryTextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.inputPlaceholder}
          />
          <PrimaryTextInput
            placeholder="Adresse (ex: 1 rue rene cassin Bessancourt)"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={colors.inputPlaceholder}
          />

          <View style={styles.imageContainer}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={24}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <MaterialCommunityIcons
                  name="camera"
                  size={24}
                  color={colors.button}
                />
                <Text style={styles.imageButtonText}>Ajouter une photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              text="Annuler"
              onPress={handleClose}
              style={[styles.button, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
            />
            <PrimaryButton
              text={loading ? "Envoi..." : "Envoyer"}
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.button, styles.submitButton]}
              textStyle={styles.submitButtonText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    width: "95%",
    borderColor: colors.border,
    borderWidth: 1,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.text,
  },
  imageContainer: {
    marginBottom: 15,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  imageButtonText: {
    marginLeft: 8,
    color: colors.text,
  },
  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.button,
  },
  cancelButtonText: {
    color: colors.text,
  },
  submitButtonText: {
    color: colors.buttonText,
  },
});
