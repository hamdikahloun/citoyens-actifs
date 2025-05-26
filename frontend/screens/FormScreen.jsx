import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { User } from "../api/User";
import PrimaryTextInput from "../components/PrimaryTextInput";

export default function FormScreen() {
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;

  const handleSubmit = async () => {
    if (!name || !postalCode) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const user = await User.create({ email, name, postalCode });
      dispatch(setUser(user));
      navigation.reset({
        index: 0,
        routes: [{ name: "MainScreen" }],
      });
    } catch (e) {
      Alert.alert("Erreur", "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations Utilisateur</Text>
      <PrimaryTextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <PrimaryTextInput
        placeholder="Code Postal"
        value={postalCode}
        onChangeText={setPostalCode}
        style={styles.input}
        keyboardType="numeric"
      />
      <PrimaryButton
        text={loading ? "Envoi..." : "Continuer"}
        onPress={handleSubmit}
        disabled={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
});
