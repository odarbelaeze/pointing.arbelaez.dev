import { Ballot } from "@/components/ballot";
import { JoinSession } from "@/components/join-session";
import { Stats } from "@/components/stats";
import { Tally } from "@/components/tally";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { clearVotes, kick, subscribeToSession } from "@/lib/pointing";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";

const PointingPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<PointingSession | "loading" | null>(
    null,
  );

  const { firestore, user } = useFirebase();

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    const unsubscribe = subscribeToSession(firestore, sessionId, (snapshot) => {
      if (!snapshot.exists()) {
        setSession(null);
        return;
      }
      const data = snapshot.data();
      setSession({
        owner: "anonymous",
        history: {},
        ...data,
        currentStory: {
          ...data.currentStory,
          startedAt: data.currentStory.startedAt.toDate(),
          endedAt: data.currentStory.endedAt?.toDate(),
        },
      });
    });
    return unsubscribe;
  }, [sessionId, firestore]);

  const allVoted = useMemo(() => {
    if (!session || session === "loading") {
      return false;
    }
    return (
      Object.entries(session.currentStory.participants || {}).length > 0 &&
      Object.keys(session.currentStory.participants || {}).every(
        (uid) =>
          session.currentStory.votes && !!session.currentStory.votes[uid],
      )
    );
  }, [session]);

  const [clearState, clear] = useAsyncFn(async () => {
    if (!sessionId || !session || session === "loading" || !allVoted) {
      return;
    }
    await clearVotes(firestore, sessionId, session.currentStory);
  }, [sessionId, session, firestore, allVoted]);

  const [leaveState, leave] = useAsyncFn(async () => {
    if (!sessionId || !user || user === "loading") {
      return;
    }
    await kick(firestore, sessionId, user.uid);
  }, [sessionId, firestore, user]);

  if (!sessionId || session === null) {
    return <div>Invalid session</div>;
  }

  if (!session || !user || user === "loading" || session === "loading") {
    return <div>Loading...</div>;
  }

  const isParticipant =
    session.currentStory.participants &&
    !!session.currentStory.participants[user.uid];
  const isObserver =
    session.currentStory.observers &&
    !!session.currentStory.observers[user.uid];

  if (!isParticipant && !isObserver) {
    return <JoinSession sessionId={sessionId} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Pointing stuff</h1>
      <div className="flex gap-2">
        {isParticipant && (
          <Button
            disabled={clearState.loading || !allVoted}
            onClick={clear}
            variant="destructive"
            className="flex-grow"
          >
            Clear votes
          </Button>
        )}
        <Button
          disabled={leaveState.loading}
          onClick={leave}
          variant="destructive"
          className="flex-grow"
        >
          Leave
        </Button>
      </div>
      {allVoted ? (
        <Stats
          story={{
            ...session.currentStory,
            endedAt: moment().utc().toDate(),
          }}
        />
      ) : (
        session.currentStory.participants &&
        !!session.currentStory.participants[user.uid] && (
          <Ballot sessionId={sessionId} />
        )
      )}
      <Tally story={session.currentStory} sessionId={sessionId} />
      <Button variant="link" size="auto" asChild>
        <Link to={`/pointing/${sessionId}/history`}>History</Link>
      </Button>
    </div>
  );
};

export default PointingPage;
