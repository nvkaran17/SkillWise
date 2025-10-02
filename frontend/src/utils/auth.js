// src/utils/auth.js
import { getAuth } from "firebase/auth";

export const getFirebaseToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return await user.getIdToken();
  } else {
    return null;
  }
};
