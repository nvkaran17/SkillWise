// src/utils/api.js
import { getFirebaseToken } from "./auth";

export const apiRequest = async (url, options = {}) => {
  const token = await getFirebaseToken();

  if (!token) {
    throw new Error("User not logged in");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
