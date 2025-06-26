import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export const Geocode = {
  search: (postalCode) => 
    apiClient.request(API_ENDPOINTS.GEOCODE.SEARCH(postalCode)),

  getCityPolygon: (postalCode) =>
    apiClient.request(API_ENDPOINTS.GEOCODE.CITY_POLYGON(postalCode)),

  getCoordinatesPolygon: (lat, lng) =>
    apiClient.request(API_ENDPOINTS.GEOCODE.COORDINATES_POLYGON(lat, lng)),

  geocodeAddress: (address) =>
    apiClient.request(API_ENDPOINTS.GEOCODE.ADDRESS(address)),
};
