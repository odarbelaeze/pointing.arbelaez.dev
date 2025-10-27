import { Stats } from "@/components/stats";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { subscribeToStory } from "@/lib/pointing";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const StatsPage = () => {
  const { sessionId, storyId } = useParams();
  const [story, setStory] = useState<Story | "loading" | null>(null);
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!sessionId || !storyId) {
      return;
    }
    const unsubscribe = subscribeToStory(
      firestore,
      sessionId,
      storyId,
      (snapshot) => {
        if (!snapshot.exists()) {
          setStory(null);
          return;
        }
        const data = snapshot.data();
        setStory({
          ...data,
          startedAt: data.startedAt.toDate(),
          endedAt: data.endedAt?.toDate(),
        });
      },
    );
    return unsubscribe;
  }, [sessionId, storyId, firestore]);

  if (story === "loading") {
    return <div>Loading...</div>;
  }

  if (!story) {
    return <div>Story not found...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="link" size="auto" asChild>
          <Link to={`/pointing/${sessionId}`}>Back</Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold">Stats</h1>
      <Stats story={story} />
    </div>
  );
};

export default StatsPage;
