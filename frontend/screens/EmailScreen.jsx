import { View, Text, StyleSheet } from "react-native";
import colors from "@/theme/colors";
import PrimaryTextInput from "@/components/PrimaryTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "@/api/Auth";
import { isValidEmail } from "@/utils/email";
import SecondaryButton from "@/components/SecondaryButton";

// écran pour rentrer son email *************************************
export default function EmailScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setError("Veuillez saisir un email valide");
      return;
    }

    setError("");
    setLoading(true);
console.log(email);
    try {
      console.log('send code');
      await Auth.sendCode(email);
      navigation.navigate("CodeScreen", { email });
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
        Entrez votre email pour vous connecter
      </Text>
      <PrimaryTextInput
        error={error}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Entrez votre email"
        autoCapitalize="none"
      />
      <PrimaryButton
        style={styles.button}
        text={loading ? "Envoi..." : "Continuer"}
        onPress={handleSendCode}
        disabled={!email || loading}
      />

      <SecondaryButton
        style={styles.button}
        text="Continuer comme invité"
        disabled={loading}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "MainScreen" }],
          })
        }
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
