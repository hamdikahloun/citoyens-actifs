import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { User } from "../api/User";

export default function SplashScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        try {
          const user = await User.me();
          dispatch(setUser(user));
          navigation.reset({
            index: 0,
            routes: [{ name: "MainScreen" }],
          });
        } catch (e) {
          await AsyncStorage.removeItem("userToken");
          navigation.reset({
            index: 0,
            routes: [{ name: "EmailScreen" }],
          });
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "EmailScreen" }],
        });
      }
    };
    checkToken();
  }, [dispatch, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
