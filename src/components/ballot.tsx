import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { vote } from "@/lib/pointing";
import { useAsyncFn } from "react-use";

interface BallotProps {
  sessionId: string;
}

export const Ballot = ({ sessionId }: BallotProps) => {
  const { firestore, user } = useFirebase();
  const [voteState, handleVote] = useAsyncFn(
    async (v: number | "?") => {
      if (!sessionId || !vote || !user || user === "loading") {
        return;
      }
      await vote(firestore, user, sessionId, v);
    },
    [sessionId, user, firestore],
  );
  return (
    <div className="grid grid-cols-3 gap-2">
      {([1, 2, 3, 5, 8, 13, 21, 34, "?"] as (number | "?")[]).map((i) => (
        <Button
          disabled={voteState.loading}
          key={i}
          onClick={() => handleVote(i)}
        >
          {i}
        </Button>
      ))}
    </div>
  );
};
