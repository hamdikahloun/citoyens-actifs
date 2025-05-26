import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function PrimaryTextInput({
  value,
  placeholder,
  onChangeText,
  error,
  ...props
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          error
            ? { borderColor: colors.error }
            : { borderColor: colors.inputBorder },
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        onChangeText={onChangeText}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: "100%",
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.inputText,
    fontWeight: "400",
    backgroundColor: "transparent",
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
    marginStart: 8,
    fontSize: 14,
  },
});
