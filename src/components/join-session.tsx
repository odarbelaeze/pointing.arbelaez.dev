import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirebase } from "@/hooks/firebase";
import { doc, setDoc } from "firebase/firestore";
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
  const { firestore, user } = useFirebase();
  const [name, setName] = useState("");

  const [joinState, join] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const participantData = {
      currentStory: {
        participants: {
          [user.uid]: { name, joinedAt: moment().utc().toDate() },
        }
      }
    }
    const sessionRef = doc(firestore, `pointing/${sessionId}`);
    await setDoc(sessionRef, participantData, { merge: true });
  }, [name, sessionId, firestore, user]);

  const [observeState, observe] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const observerData = {
      currentStory: {
        observers: {
          [user.uid]: { name, joinedAt: moment().utc().toDate() },
        }
      }
    };
    const sessionRef = doc(firestore, `pointing/${sessionId}`);
    await setDoc(sessionRef, observerData, { merge: true });
  }, [name, sessionId, firestore, user]);

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
