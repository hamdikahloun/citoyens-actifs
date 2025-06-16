import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react'; 
import { useDispatch } from 'react-redux';
import { addEmail } from '../reducers/user';


export default function Email({ navigation }) {

  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleAddEmail = () => {
    dispatch(addEmail(email));
    navigation.navigate('Code');
  };

 return (
   <View style={styles.container}>
    <Text style={styles.h1} >Citoyens Actifs</Text>
     <Text>Entrez votre email pour vous connecter</Text>
     <TextInput
     style={styles.textInput}
     placeholder="Entrez votre email"
     keyboardType="email-address"
     value={email}
     onChangeText={setEmail}
     />
      <TouchableOpacity style={styles.button} onPress={handleAddEmail}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>

   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
   gap: 25, // Ajoute automatiquement 25px d’espace entre chaque enfant. (>React Native 0.71)
 },

 textInput: {
  borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    width: 300,
  },

  h1: {
    fontWeight: 'bold',
    fontSize: 24
  },

  button: {
    backgroundColor: '#195776',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
  },

  buttonText: {
    color: '#fff',                   // Texte blanc
    fontWeight: '600',               // Semi-gras
    fontSize: 16,
  }

});