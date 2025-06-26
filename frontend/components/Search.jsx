import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/theme/colors";

// champ de texte code postal **********************************************
export default function Search({ value, onChangeText, onSearch }) {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        placeholder="Code postal"
        value={value}
        keyboardType="numeric"
        onChangeText={onChangeText}
        style={styles.searchBar}
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <MaterialCommunityIcons name="magnify" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
  },
  searchBar: {
    fontSize: 16,
    flex: 1,
    padding: 12,
  },
  searchButton: {
    padding: 12,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
