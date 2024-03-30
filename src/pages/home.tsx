import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { addDoc, collection } from "firebase/firestore";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const HomePage = () => {
  const navigate = useNavigate();
  const { firestore, user } = useFirebase();

  const [state, createSession] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const newSession = {
      owner: user.uid,
      currentStory: {
        startedAt: moment().utc().toDate(),
        participants: {},
        observers: {},
        votes: {},
      },
    };
    const sessionRef = await addDoc(collection(firestore, "pointing"), newSession);
    navigate(`/pointing/${sessionRef.id}`);
  }, [navigate, user, firestore]);

  return (
    <div className="flex flex-col gap-8 items-center">
      <Button disabled={state.loading} onClick={createSession}>
        Start session
      </Button>
    </div>
  );
};
