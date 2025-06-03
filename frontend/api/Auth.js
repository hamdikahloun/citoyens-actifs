import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Auth = {
  sendCode: (email) => {
    return apiClient.request(API_ENDPOINTS.AUTH.SEND_CODE, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyCode: (email, code) => {
    return apiClient.request(API_ENDPOINTS.AUTH.VERIFY_CODE, {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  logout: () => {
    return AsyncStorage.removeItem("userToken");
  },
};
