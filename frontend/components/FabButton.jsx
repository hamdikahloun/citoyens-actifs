import React from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "@/theme/colors";

// boutons de l'écran MainScreen ************************************************
export default function FabButton({ onPress, iconName, style, isLoading }) {
  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.buttonText} />
      ) : (
        <MaterialCommunityIcons
          name={iconName}
          size={28}
          color={colors.buttonText}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: colors.button,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
