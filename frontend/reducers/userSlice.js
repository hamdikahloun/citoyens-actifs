import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  name: "",
  postalCode: "",
  cityCoords: null,
  role: "",
  _id: "",
  address: "",
  phone: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      console.log(action.payload);
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.postalCode = action.payload.postalCode;
      state.cityCoords = action.payload.cityCoords;
      state.role = action.payload.role;
      state._id = action.payload._id;
    },
    logout() {
      return initialState;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
