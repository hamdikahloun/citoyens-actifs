import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux' ;


export default function Code({ navigation }) {

  const email = useSelector((state) => state.user);

 return (
   <View style={styles.container}>
    <Text style={styles.h1} >Citoyens Actifs</Text>
     <Text>Entrez le code reçu à l'adresse {email}</Text>
     <TextInput
     style={styles.textInput}
     placeholder="Entrez votre code"
     //value={texte}
     //onChangeText={setTexte}
     />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InfoClient')}>
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