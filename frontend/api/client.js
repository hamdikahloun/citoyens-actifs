import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = await AsyncStorage.getItem("userToken");

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return response.json();
  },
};
