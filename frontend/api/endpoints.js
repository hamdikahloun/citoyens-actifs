export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SEND_CODE: "/auth/send-code",
    VERIFY_CODE: "/auth/verify-code",
  },
  // User endpoints
  USER: {
    ME: "/user/me",
    CREATE: "/user",
  },
  // Feedback endpoints
  FEEDBACK: {
    LIST: "/feedback",
    CREATE: "/feedback",
    ADD_COMMENT: (id) => `/feedback/${id}/comment`,
  },
  // Geocoding endpoints
  GEOCODE: {
    SEARCH: (postalCode) => `/geocode?postalCode=${postalCode}`,
    CITY_POLYGON: (postalCode) =>
      `/geocode/city-polygon?postalCode=${postalCode}`,
    ADDRESS: "/geocode/address",
  },
};
