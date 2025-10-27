import { Button } from "@/components/ui/button";
import { Moment } from "@/components/ui/moment";
import { useFirebase } from "@/hooks/firebase";
import { subscribeToHistory } from "@/lib/pointing";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const HistoryPage = () => {
  const { sessionId } = useParams();
  const { firestore, user } = useFirebase();
  const [history, setHistory] = useState<
    { id: string; story: Story }[] | "loading"
  >("loading");

  useEffect(() => {
    if (!sessionId || !user || user === "loading") {
      return;
    }
    const unsubscribe = subscribeToHistory(firestore, sessionId, (snapshot) => {
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
        }),
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
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="link" size="auto" asChild>
          <Link to={`/pointing/${sessionId}`}>Back</Link>
        </Button>
      </div>
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

export default HistoryPage;
