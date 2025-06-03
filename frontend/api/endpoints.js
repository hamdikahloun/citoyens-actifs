export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SEND_CODE: "/auth/send-code",
    VERIFY_CODE: "/auth/verify-code",
  },
  // User endpoints
  USER: {
    ME: "/users/me",
    CREATE: "/users",
  },
  // Feedback endpoints
  FEEDBACK: {
    LIST: (postalCode) => `/feedback?postalCode=${postalCode}`,
    CREATE: "/feedback",
    ADD_COMMENT: (id) => `/feedback/${id}/comments`,
  },
  // Geocoding endpoints
  GEOCODE: {
    SEARCH: (postalCode) => `/geocode?postalCode=${postalCode}`,
    CITY_POLYGON: (postalCode) =>
      `/geocode/city-polygon?postalCode=${postalCode}`,
    COORDINATES_POLYGON: (lat, lng) =>
      `/geocode/coordinates-polygon?lat=${lat}&lng=${lng}`,
    ADDRESS: (address) => `/geocode/address?address=${address}`,
  },
};
