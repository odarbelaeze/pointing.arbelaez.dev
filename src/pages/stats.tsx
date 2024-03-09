import { Stats } from "@/components/stats";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const StatsPage = () => {
  const { sessionId, storyId } = useParams();
  const [story, setStory] = useState<Story | "loading" | null>(null);
  const { db } = useFirebase();

  useEffect(() => {
    if (!sessionId || !storyId) {
      return;
    }
    const storyRef = ref(db, `sessions/${sessionId}/history/${storyId}`);
    const unsubscribe = onValue(storyRef, (snapshot) => {
      if (!snapshot.exists()) {
        setStory(null);
        return;
      }
      setStory(snapshot.val());
    });
    return unsubscribe;
  }, [sessionId, storyId, db]);

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
