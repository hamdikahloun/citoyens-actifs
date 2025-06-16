import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: '',
  reducers: {
    addEmail: (state, action) => action.payload,
    confirmCode: (state, action) => action.payload,
    clearEmail: () => '',
  },
});

export const { addEmail, clearEmail, confirmCode } = userSlice.actions;
export default userSlice.reducer;