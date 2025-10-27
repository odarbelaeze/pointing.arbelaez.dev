import { FirebaseContext, initialState } from "@/contenxt/firebase-context";
import { User, signInAnonymously } from "firebase/auth";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface FirebaseProviderProps {
  children: ReactNode;
}

const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | "loading" | null>("loading");
  const value = useMemo(() => ({ ...initialState, user }), [user]);
  const { auth } = initialState;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user !== null) {
      return;
    }
    signInAnonymously(auth).catch((error) => {
      console.error("Failed to sign in anonymously", error);
    });
  }, [auth, user]);

  if (user === "loading") {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <div>Signing you in anonymously...</div>;
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
