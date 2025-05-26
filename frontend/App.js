import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmailScreen from "./screens/EmailScreen";
import CodeScreen from "./screens/CodeScreen";
import MainScreen from "./screens/MainScreen";
import FormScreen from "./screens/FormScreen";
import SplashScreen from "./screens/SplashScreen";
import MyAccountScreen from "./screens/MyAccountScreen";
import { Provider } from "react-redux";
import store from "./store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="EmailScreen" component={EmailScreen} />
          <Stack.Screen name="CodeScreen" component={CodeScreen} />
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="FormScreen" component={FormScreen} />
          <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
