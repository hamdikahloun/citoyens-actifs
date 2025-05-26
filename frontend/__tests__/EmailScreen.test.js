import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EmailScreen from "../screens/EmailScreen";
import * as api from "../utils/api";

// Mock de l'API
jest.spyOn(api, "sendVerificationCode").mockResolvedValue();

describe("EmailScreen", () => {
  it("affiche le titre", () => {
    const { getByText } = render(<EmailScreen />);
    expect(getByText("Citoyens Actifs")).toBeTruthy();
  });

  it("affiche une erreur si l'email est invalide", async () => {
    const { getByText, getByPlaceholderText } = render(<EmailScreen />);
    fireEvent.changeText(
      getByPlaceholderText("Entrez votre email"),
      "notanemail",
    );
    fireEvent.press(getByText("Continuer"));
    await waitFor(() => {
      expect(getByText("Veuillez saisir un email valide")).toBeTruthy();
    });
  });
});
