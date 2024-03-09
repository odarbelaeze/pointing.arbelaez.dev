import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { User, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

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
if (import.meta.env.MODE === 'development') {
  console.info('Development mode detected, using debug token');
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
}
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfLTZApAAAAAMJH2libaBDoAkJat64-BEE2kGJk"),
  isTokenAutoRefreshEnabled: true,
});
const db = getDatabase(app);
const auth = getAuth(app);

interface FirebaseProviderProps {
  children: ReactNode;
}

interface FirebaseProviderState {
  app: typeof app;
  analytics: typeof analytics;
  appCheck: typeof appCheck;
  db: typeof db;
  auth: typeof auth;
  user: User | 'loading' | null;
}

const initialState: FirebaseProviderState = {
  app,
  analytics,
  appCheck,
  db,
  auth,
  user: null,
};

const FirebaseContext = createContext<FirebaseProviderState>(initialState);

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | 'loading' | null>('loading');
  const value = useMemo(() => ({ ...initialState, user }), [user]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
