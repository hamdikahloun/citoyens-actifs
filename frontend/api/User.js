import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export const User = {
  me: () => {
    return apiClient.request(API_ENDPOINTS.USER.ME);
  },

  create: ({ email, name, postalCode }) => {
    return apiClient.request(API_ENDPOINTS.USER.CREATE, {
      method: "POST",
      body: JSON.stringify({ email, name, postalCode }),
    });
  },
};
