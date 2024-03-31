import { Button } from "@/components/ui/button";
import { Moment } from "@/components/ui/moment";
import { useFirebase } from "@/hooks/firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HistoryProps {
  sessionId: string;
}

export const History = ({ sessionId }: HistoryProps) => {
  const { firestore, user } = useFirebase();
  const [history, setHistory] = useState<
    { id: string; story: Story }[] | "loading"
  >("loading");

  useEffect(() => {
    if (!sessionId || !user || user === "loading") {
      return;
    }
    const queryRef = query(
      collection(firestore, `pointing/${sessionId}/history`),
      orderBy("startedAt", "desc"),
      limit(100)
    );
    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      if (snapshot.empty) {
        setHistory([]);
        return;
      }
      setHistory(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            story: {
              ...data,
              // FIXME: This is a bit hacky
              startedAt: data.startedAt.toDate(),
              endedAt: data.endedAt.toDate(),
            },
          };
        })
      );
    });
    return unsubscribe;
  }, [sessionId, firestore, user]);

  if (history === "loading") {
    return <div>Loading...</div>;
  }

  if (history.length === 0) {
    return <div>No stories pointed yet...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">History</h2>
      <ul className="flex flex-col gap-2 list-disc">
        {history.map(({ id, story }) => (
          <li key={id} className="flex gap-4 max-w-[24ch]">
            <Button variant="link" size="auto" asChild>
              <Link to={`/pointing/${sessionId}/stats/${id}`}>
                <Moment dateTime={story.endedAt} />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
