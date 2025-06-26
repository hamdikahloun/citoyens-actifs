import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "@/theme/colors";

// bouton blanc (ex bouton guest) *****************************************
export default function SecondaryButton({
  text = "Continuer",
  onPress,
  style,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      disabled={disabled}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondaryButton,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  text: {
    color: colors.secondaryButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
});
