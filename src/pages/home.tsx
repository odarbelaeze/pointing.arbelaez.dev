import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const HomePage = () => {
  const navigate = useNavigate();
  const { db, user } = useFirebase();

  const [state, createSession] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const sessionRef = push(ref(db, "sessions"), {
      currentStory: {
        description: "",
        startedAt: (new Date()).toISOString(),
        participants: {},
      },
      history: {},
    });
    navigate(`/pointing/${sessionRef.key}`);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-8 items-center">
      <Button disabled={state.loading} onClick={createSession}>
        Start session
      </Button>
    </div>
  );
};
