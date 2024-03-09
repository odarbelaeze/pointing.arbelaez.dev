import { FirebaseContext } from "@/components/providers/firebase-provider";
import { useContext } from "react";

export const useFirebase = () => {
  return useContext(FirebaseContext);
}
