jest.mock("expo-status-bar");

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

jest.mock("expo-constants", () => ({
  manifest: {
    extra: {
      apiUrl: "http://localhost:3000",
    },
  },
}));
