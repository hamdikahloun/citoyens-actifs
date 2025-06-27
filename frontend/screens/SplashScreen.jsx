import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { setUser } from "@/reducers/userSlice";
import { useDispatch } from "react-redux";
import { User } from "@/api/User";
import colors from "@/theme/colors";

// écran de chargement => redirige vers mainscreen ou email selon validité du token ***************
export default function SplashScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const user = await User.me();
        dispatch(setUser(user));
        navigation.reset({
          index: 0,
          routes: [{ name: "MainScreen" }],
        });
      } catch (e) {
        console.log(e);
        AsyncStorage.removeItem("userToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "EmailScreen" }],
        });
      }
    };
    checkToken();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
