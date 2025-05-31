import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { Auth } from "../api/Auth";

export default function MyAccountScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    await Auth.logout();
    dispatch(setUser(null));
    navigation.reset({
      index: 0,
      routes: [{ name: "EmailScreen" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>
      <Text style={styles.subtitle}>{user.email}</Text>
      <Text style={styles.info}>Nom: {user.name}</Text>
      <Text style={styles.info}>Code Postal: {user.postalCode}</Text>
      <PrimaryButton
        style={styles.button}
        text="Se déconnecter"
        onPress={handleLogout}
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
  info: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
});
