const API_URL = "https://citoyens-actifs.vercel.app";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const sendVerificationCode = async (email) => {
  const response = await fetch(`${API_URL}/auth/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send verification code");
  }

  return await response.json();
};

export const verifyCode = async (email, code) => {
  const response = await fetch(`${API_URL}/auth/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to verify code");
  }

  return await response.json();
};

// Submit feedback
export const submitFeedback = async (feedbackData) => {
  const response = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit feedback");
  }
  return await response.json();
};

// Add a comment to feedback
export const addComment = async (feedbackId, commentData) => {
  const response = await fetch(`${API_URL}/feedback/${feedbackId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add comment");
  }
  return await response.json();
};

export const authFetch = async (url, options = {}) => {
  const token = await AsyncStorage.getItem("userToken");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};
