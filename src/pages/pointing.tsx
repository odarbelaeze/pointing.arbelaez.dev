import { Ballot } from "@/components/ballot";
import { History } from "@/components/history";
import { JoinSession } from "@/components/join-session";
import { Stats } from "@/components/stats";
import { Tally } from "@/components/tally";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const PointingPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<PointingSession | "loading" | null>(
    null,
  );

  const { firestore, user } = useFirebase();

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    const sessionRef = doc(firestore, `pointing/${sessionId}`);
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
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
    const newStory = {
      ...session.currentStory,
      endedAt: moment().utc().toDate(),
    };
    await addDoc(
      collection(firestore, `pointing/${sessionId}/history`),
      newStory,
    );
    await setDoc(
      doc(firestore, `pointing/${sessionId}`),
      {
        currentStory: {
          votes: {},
          startedAt: moment().utc().toDate(),
        },
      },
      { merge: true },
    );
  }, [sessionId, session, firestore, allVoted]);

  const [leaveState, leave] = useAsyncFn(async () => {
    if (!sessionId || !user || user === "loading") {
      return;
    }
    const removeData = {
      currentStory: {
        participants: {
          [user.uid]: deleteField(),
        },
        observers: {
          [user.uid]: deleteField(),
        },
      },
    };
    const sessionRef = doc(firestore, `pointing/${sessionId}`);
    await setDoc(sessionRef, removeData, { merge: true });
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
      <Tally story={session.currentStory} />
      <History sessionId={sessionId} />
    </div>
  );
};
