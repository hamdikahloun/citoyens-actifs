import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import { Auth } from "../api/Auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MyAccountScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    Auth.logout();
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "EmailScreen" }],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.logoutButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
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
  logoutButton: {
    position: "absolute",
    top: 54,
    start: 16,
    zIndex: 10,
    padding: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
