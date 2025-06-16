import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Email from './screens/Email';
import Code from './screens/Code';
import InfoClient from './screens/InfoClient';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import user from './reducers/user';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


const store = configureStore({
 reducer: { user },
});

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Email">
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="Code" component={Code} />
        <Stack.Screen name="InfoClient" component={InfoClient} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
