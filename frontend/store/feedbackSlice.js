import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedbacks(state, action) {
      state.items = action.payload;
    },
    addFeedback(state, action) {
      state.items.push(action.payload);
    },
  },
});

export const { setFeedbacks, addFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
