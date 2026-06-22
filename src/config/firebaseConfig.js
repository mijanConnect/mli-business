import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

let messaging = null;

try {
  if (missingFirebaseKeys.length > 0) {
    console.warn(
      "[Firebase] Missing env vars:",
      missingFirebaseKeys.join(", "),
    );
  } else {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  }
} catch (error) {
  console.error("[Firebase] Initialization error:", error);
}

export { messaging };
