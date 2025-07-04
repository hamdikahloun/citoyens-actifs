import { useNavigation } from "@react-navigation/native";
import FabButton from "./FabButton";
import { useSelector } from "react-redux";

// bouton logout (guest) ou compte (user) ******************************
export default function MyAccountFab({ style }) {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "EmailScreen" }],
    });
  };

  const handlePress = () => {
    if (user.email) {
      navigation.navigate("MyAccountScreen");
    } else {
      handleLogout();
    }
  };

  return (
    <FabButton
      style={style}
      onPress={handlePress}
      iconName={user.email ? "account" : "logout"}
    />
  );
}
