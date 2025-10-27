import { FirebaseContext } from "@/contenxt/firebase-context";
import { useContext } from "react";

export const useFirebase = () => {
  return useContext(FirebaseContext);
};
