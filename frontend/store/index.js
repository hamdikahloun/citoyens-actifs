import { configureStore } from "@reduxjs/toolkit";
import feedbackReducer from "@/reducers/feedbackSlice";
import userReducer from "@/reducers/userSlice";

const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
    user: userReducer,
  },
});

export default store;
