import { View, Text, StyleSheet } from "react-native";
import colors from "@/theme/colors";
import PrimaryTextInput from "@/components/PrimaryTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "@/reducers/userSlice";
import { Auth } from "@/api/Auth";

// écran validation du code reçu par mail *******************************
export default function CodeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerification = async () => {
    if (code.length !== 6) {
      setError("Veuillez saisir un code valide");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { token, user } = await Auth.verifyCode(email, code);
      await AsyncStorage.setItem("userToken", token);
      if (user) {
        dispatch(setUser(user));
        navigation.reset({
          index: 0,
          routes: [{ name: "MainScreen" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "FormScreen", params: { email } }],
        });
      }
    } catch (error) {
      setError(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citoyens Actifs</Text>
      <Text style={styles.subtitle}>
        Entrez le code reçu à l'adresse {email}
      </Text>
      <PrimaryTextInput
        error={error}
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        placeholder="Entrez votre code"
        maxLength={6}
      />
      <PrimaryButton
        style={styles.button}
        text={loading ? "Vérification..." : "Continuer"}
        onPress={handleVerification}
        disabled={code.length !== 6 || loading}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
});
