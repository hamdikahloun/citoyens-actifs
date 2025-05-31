import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    name: "",
    postalCode: "",
    cityCoords: null,
  },
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.postalCode = action.payload.postalCode;
      state.cityCoords = action.payload.cityCoords;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
