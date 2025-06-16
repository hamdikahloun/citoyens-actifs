import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux' ;
import { useState } from 'react';
import { Alert } from 'react-native';


export default function Code({ navigation }) {

  //email stocké depuis Email.js
  const email = useSelector((state) => state.user);
  const [code, setCode] = useState('');

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('http://192.168.1.60:3000/users/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {

        navigation.navigate('InfoClient');
      } else {
        Alert.alert('Erreur', data.error || 'Code incorrect');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      Alert.alert('Erreur', "Impossible de vérifier le code");
    }
  };

 return (
   <View style={styles.container}>
    <Text style={styles.h1} >Citoyens Actifs</Text>
     <Text>Entrez le code reçu à l'adresse {email}</Text>

     <TextInput
     style={styles.textInput}
     placeholder="Entrez votre code"
     value={code}
     onChangeText={setCode}
     keyboardType="numeric"
     />

      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
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