import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirebase } from "@/hooks/firebase";
import { ref, set } from "firebase/database";
import moment from "moment";
import { useCallback, useState } from "react";
import { useAsyncFn } from "react-use";

interface JoinSessionProps {
  sessionId: string;
}

const validateName = (name: string) => {
  return !!name && name.length > 2 && name.length < 100;
};

export const JoinSession = ({ sessionId }: JoinSessionProps) => {
  const { db, user } = useFirebase();
  const [name, setName] = useState("");

  const [joinState, join] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const participantRef = ref(
      db,
      `sessions/${sessionId}/currentStory/participants/${user.uid}`,
    );
    await set(participantRef, { name, joinedAt: moment().utc().toISOString() });
  }, [name, sessionId, db, user]);

  const [observeState, observe] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const observerRef = ref(
      db,
      `sessions/${sessionId}/currentStory/observers/${user.uid}`,
    );
    await set(observerRef, { name, joinedAt: moment().utc().toISOString() });
  }, [name, sessionId, db, user]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateName(name) || joinState.loading) {
        return;
      }
      join();
    },
    [name, join, joinState.loading],
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Join session</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder="John"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!validateName(name) || observeState.loading}
            onClick={observe}
            variant="secondary"
            type="button"
            className="flex-grow"
          >
            Observe
          </Button>
          <Button
            disabled={!validateName(name) || joinState.loading}
            type="submit"
            className="flex-grow"
          >
            Join
          </Button>
        </div>
      </form>
    </div>
  );
};
