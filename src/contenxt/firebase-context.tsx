import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { User, connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { createContext } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAThH43LVyIzrEX4_mIWhivk4wawWrusVg",
  authDomain: "pointing-stuff.firebaseapp.com",
  databaseURL: "https://pointing-stuff-default-rtdb.firebaseio.com",
  projectId: "pointing-stuff",
  storageBucket: "pointing-stuff.appspot.com",
  messagingSenderId: "581232274349",
  appId: "1:581232274349:web:a98d42dbd69ecf11ab4f24",
  measurementId: "G-3NGNW8160G",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
if (import.meta.env.MODE === "development") {
  console.info("Development mode detected, using debug token");
  self.FIREBASE_APPCHECK_DEBUG_TOKEN =
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
}
const firestore = getFirestore(app);
const auth = getAuth(app);

if (import.meta.env.VITE_USE_EMULATORS === "true") {
  console.info("Using firebase emulators");
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
} else {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6LfLTZApAAAAAMJH2libaBDoAkJat64-BEE2kGJk",
    ),
    isTokenAutoRefreshEnabled: true,
  });
}

interface FirebaseContextState {
  app: typeof app;
  analytics: typeof analytics;
  firestore: typeof firestore;
  auth: typeof auth;
  user: User | "loading" | null;
}

export const initialState: FirebaseContextState = {
  app,
  analytics,
  firestore,
  auth,
  user: null,
};

export const FirebaseContext =
  createContext<FirebaseContextState>(initialState);
FirebaseContext.displayName = "FirebaseContext";
