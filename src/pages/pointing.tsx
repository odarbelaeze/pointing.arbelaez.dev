import { Ballot } from "@/components/ballot";
import { Stats } from "@/components/stats";
import { Tally } from "@/components/tally";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Moment } from "@/components/ui/moment";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const PointingPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<PointingSession | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const session: PointingSession = {
      currentStory: {
        description: "As a user I want to see the list of stories",
        startedAt: "2024-03-02 21:23",
        participants: {
          aasawer234234asdf: { name: "John" },
          aklsjdflkjsadlfkj: { name: "Jane" },
          aklsjdflkjsadrfkj: { name: "Dave" },
        },
        votes: {
          aasawer234234asdf: 5,
          aklsjdflkjsadlfkj: 5,
        },
      },
      history: [],
    };
    const timeout = setTimeout(() => {
      setSession(session);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [sessionId]);

  useEffect(() => {
    if (!session) {
      return;
    }
    setDescription(session.currentStory.description);
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  const allVoted = Object.keys(session.currentStory.participants).every(
    (uid) => !!session.currentStory.votes[uid],
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Pointing stuff</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-description">Story description</Label>
        <Textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onBlur={() => {
            console.log("Save description");
          }}
          id="story-description"
          placeholder="As a user..."
        />
      </div>
      <div className="flex gap-2">
        <Button variant="destructive" className="flex-grow">
          Clear votes
        </Button>
        <Button className="flex-grow">Reveal votes</Button>
      </div>
      {allVoted ? (
        <Stats
          story={{ ...session.currentStory, endedAt: moment().toISOString() }}
        />
      ) : (
        <Ballot onVote={console.log} />
      )}
      <Tally story={session.currentStory} />
      {Object.entries(session.history).length > 0 && (
        <ul className="flex flex-col gap-2 list-disc">
          {Object.entries(session.history).map(([uid, { startedAt }]) => (
            <li key={uid} className="flex gap-4 max-w-[24ch]">
              <Button variant="link" size="auto" asChild>
                <Link to={`/pointing/${sessionId}/stats/${uid}`}>
                  <Moment dateTime={startedAt} />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
