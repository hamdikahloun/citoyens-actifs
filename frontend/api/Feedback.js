import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export const Feedback = {
  list: (postalCode) => {
    return apiClient.request(API_ENDPOINTS.FEEDBACK.LIST(postalCode));
  },

  create: (data) => {
    return apiClient.request(API_ENDPOINTS.FEEDBACK.CREATE, {
      method: "POST",
      body: data,
    });
  },

  addComment: (id, comment) =>
    apiClient.request(API_ENDPOINTS.FEEDBACK.ADD_COMMENT(id), {
      method: "POST",
      body: JSON.stringify({ comment }),
      headers: { "Content-Type": "application/json" },
    }),

  updateStatus: (id, status) =>
    apiClient.request(API_ENDPOINTS.FEEDBACK.UPDATE_STATUS(id), {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    }),
};
