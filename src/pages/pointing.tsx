import { Ballot } from "@/components/ballot";
import { History } from "@/components/history";
import { JoinSession } from "@/components/join-session";
import { Stats } from "@/components/stats";
import { Tally } from "@/components/tally";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { onValue, push, ref, set } from "firebase/database";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const PointingPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<PointingSession | "loading" | null>(
    null,
  );

  const { db, user } = useFirebase();

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    const sessionRef = ref(db, `sessions/${sessionId}`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSession(null);
        return;
      }
      setSession({
        owner: "anonymous",
        currentStory: {},
        history: {},
        ...snapshot.val(),
      });
    });
    return unsubscribe;
  }, [sessionId, db]);

  const allVoted = useMemo(() => {
    if (!session || session === "loading") {
      return false;
    }
    return Object.keys(session.currentStory.participants || {}).every(
      (uid) => session.currentStory.votes && !!session.currentStory.votes[uid],
    );
  }, [session]);

  const [clearState, clear] = useAsyncFn(async () => {
    if (!sessionId || !session || session === "loading" || !allVoted) {
      return;
    }
    const newStory = {
      endedAt: moment().utc().toISOString(),
      ...session.currentStory,
    };
    await push(ref(db, `sessions/${sessionId}/history`), newStory);
    await set(ref(db, `sessions/${sessionId}/currentStory/votes`), {});
    await set(
      ref(db, `sessions/${sessionId}/currentStory/startedAt`),
      moment().utc().toISOString(),
    );
  }, [sessionId, session, db, allVoted]);

  if (!sessionId || session === null) {
    return <div>Invalid session</div>;
  }

  if (!session || !user || user === "loading" || session === "loading") {
    return <div>Loading...</div>;
  }

  if (
    !session.currentStory.participants ||
    !session.currentStory.participants[user.uid]
  ) {
    return <JoinSession sessionId={sessionId} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Pointing stuff</h1>
      <div className="flex gap-2">
        <Button
          disabled={clearState.loading || !allVoted}
          onClick={clear}
          variant="destructive"
          className="flex-grow"
        >
          Clear votes
        </Button>
      </div>
      {allVoted ? (
        <Stats
          story={{
            ...session.currentStory,
            endedAt: moment().utc().toISOString(),
          }}
        />
      ) : (
        <Ballot sessionId={sessionId} />
      )}
      <Tally story={session.currentStory} />
      <History sessionId={sessionId} history={session.history} />
    </div>
  );
};
