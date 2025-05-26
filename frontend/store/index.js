import { configureStore } from "@reduxjs/toolkit";
import feedbackReducer from "./feedbackSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
    user: userReducer,
  },
});

export default store;
