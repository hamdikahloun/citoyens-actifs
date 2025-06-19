export const API_ENDPOINTS = {
  AUTH: {
    SEND_CODE: "/auth/send-code",
    VERIFY_CODE: "/auth/verify-code",
  },
  USER: {
    ME: "/users/me",
    CREATE: "/users",
  },
  FEEDBACK: {
    LIST: (postalCode) => `/feedback?postalCode=${postalCode}`,
    CREATE: "/feedback",
    ADD_COMMENT: (id) => `/feedback/${id}/comments`,
    //UPDATE_STATUS: (id) => `/feedback/${id}/status`,
  },
  GEOCODE: {
    SEARCH: (postalCode) => `/geocode?postalCode=${postalCode}`,
    CITY_POLYGON: (postalCode) =>
      `/geocode/city-polygon?postalCode=${postalCode}`,
    COORDINATES_POLYGON: (lat, lng) =>
      `/geocode/coordinates-polygon?lat=${lat}&lng=${lng}`,
    ADDRESS: (address) => `/geocode/address?address=${address}`,
  },
};
