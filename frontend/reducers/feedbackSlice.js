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
    updateFeedback(state, action) {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { setFeedbacks, addFeedback, updateFeedback } =
  feedbackSlice.actions;
export default feedbackSlice.reducer;
