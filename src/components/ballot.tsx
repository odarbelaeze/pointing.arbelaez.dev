import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAsyncFn } from "react-use";

interface BallotProps {
  sessionId: string;
}

export const Ballot = ({ sessionId }: BallotProps) => {
  const { firestore, user } = useFirebase();
  const [voteState, vote] = useAsyncFn(
    async (vote: number | "?") => {
      if (!sessionId || !vote || !user || user === "loading") {
        return;
      }
      const voteData = {
        currentStory: {
          votes: {
            [user.uid]: vote,
          },
        },
      };
      const sessionRef = doc(firestore, `pointing/${sessionId}`);
      await setDoc(sessionRef, voteData, { merge: true });
    },
    [sessionId, user, firestore],
  );
  return (
    <div className="grid grid-cols-3 gap-2">
      {([1, 2, 3, 5, 8, 13, 21, 34, "?"] as (number | "?")[]).map((i) => (
        <Button disabled={voteState.loading} key={i} onClick={() => vote(i)}>
          {i}
        </Button>
      ))}
    </div>
  );
};
