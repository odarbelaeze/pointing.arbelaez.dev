import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { ref, push } from "firebase/database";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const HomePage = () => {
  const navigate = useNavigate();
  const { db, user } = useFirebase();

  const [state, createSession] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const newSession = {
      owner: user.uid,
      currentStory: {
        description: "",
        startedAt: moment().utc().toISOString(),
        participants: {},
        votes: {},
      },
      history: {},
    };
    const sessionRef = await push(ref(db, "sessions"), newSession);
    navigate(`/pointing/${sessionRef.key}`);
  }, [navigate, user, db]);

  return (
    <div className="flex flex-col gap-8 items-center">
      <Button disabled={state.loading} onClick={createSession}>
        Start session
      </Button>
    </div>
  );
};
