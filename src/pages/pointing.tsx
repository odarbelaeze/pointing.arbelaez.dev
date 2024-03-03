import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Moment } from "@/components/ui/moment";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Story = {
  description: string;
  startedAt: string;
  endedAt: string;
  participants: { [uid: string]: { name: string } };
  votes: { [uid: string]: number | "?" | null };
};

type PointingSession = {
  currentStory: Omit<Story, "endedAt">;
  history: Story[];
};

export const Pointing = () => {
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
        },
        votes: {
          aasawer234234asdf: 5,
          aklsjdflkjsadlfkj: "?",
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
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 5, 8, 13, 21, 34, "?"].map((i) => (
          <Button key={i} onClick={() => console.log(i)}>
            {i}
          </Button>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {Object.entries(session.currentStory.participants).map(
          ([uid, { name }]) => (
            <li key={uid} className="flex gap-4 items-center max-w-[24ch]">
              <span
                title={name}
                className="flex-grow whitespace-nowrap overflow-hidden overflow-ellipsis"
              >
                {name}
              </span>
              {allVoted ? (
                <span>{session.currentStory.votes[uid]}</span>
              ) : (
                <div
                  className="flex-shrink-0 bg-foreground w-8 h-4 rounded-md"
                  aria-label="hidden vote"
                />
              )}
            </li>
          ),
        )}
      </ul>
      <ul className="flex flex-col gap-2 list-disc">
        {[
          {
            uid: "aasawer234234asdf",
            description: "As a user I want to see the list of stories",
            startedAt: "2024-03-02 21:23",
            endedAt: "2022-01-01T00:00:00Z",
          },
          {
            uid: "aklsjdflkjsadlfkj",
            description: "As a user I want to see the list of stories",
            startedAt: "2024-03-02 22:20",
            endedAt: "2023-01-01T00:00:00Z",
          },
        ].map(({ uid, startedAt }) => (
          <li key={uid} className="flex gap-4 max-w-[24ch]">
            <Button variant="link" size="auto" asChild>
              <Link to={`/pointing/${sessionId}/stats/${uid}`}>
                <Moment dateTime={startedAt} />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
