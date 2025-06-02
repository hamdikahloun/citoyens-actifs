import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  name: "",
  postalCode: "",
  cityCoords: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.postalCode = action.payload.postalCode;
      state.cityCoords = action.payload.cityCoords;
    },
    logout() {
      return initialState;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
