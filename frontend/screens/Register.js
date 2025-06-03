import { StyleSheet, Text, View } from 'react-native';


export default function Register({ navigation }) {
 return (
   <View>
     <Text>Home Screen</Text>
     <Button
       title="Go to Profile"
       onPress={() => navigation.navigate('Profile')}
     />
   </View>
 );
}