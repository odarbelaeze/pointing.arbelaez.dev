import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Moment } from "@/components/ui/moment";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router-dom";

export const Pointing = () => {
  const { sessionId } = useParams();
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Pointing stuff</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-description">Story description</Label>
        <Textarea id="story-description" placeholder="As a user..." />
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
        {[
          "John",
          "Jane",
          "Dave",
          "Some random huge name of the hard to read and all",
        ].map((name) => (
          <li key={name} className="flex gap-4 items-center max-w-[24ch]">
            <span
              title={name}
              className="flex-grow whitespace-nowrap overflow-hidden overflow-ellipsis"
            >
              {name}
            </span>
            <div
              className="flex-shrink-0 bg-foreground w-8 h-4"
              aria-label="hidden vote"
            />
          </li>
        ))}
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
