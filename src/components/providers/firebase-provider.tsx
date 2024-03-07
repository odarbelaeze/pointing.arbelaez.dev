import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { getDatabase } from "firebase/database";
import { ReactNode, createContext } from "react";

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
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfLTZApAAAAAMJH2libaBDoAkJat64-BEE2kGJk"),
  isTokenAutoRefreshEnabled: true,
});
const db = getDatabase(app);

interface FirebaseProviderProps {
  children: ReactNode;
}

interface FirebaseProviderState {
  app: typeof app;
  analytics: typeof analytics;
  appCheck: typeof appCheck;
  db: typeof db;
}

const initialState: FirebaseProviderState = {
  app,
  analytics,
  appCheck,
  db,
};

const FirebaseContext = createContext<FirebaseProviderState>(initialState);

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  return (
    <FirebaseContext.Provider value={initialState}>
      {children}
    </FirebaseContext.Provider>
  );
};
