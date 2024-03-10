import { Button } from "@/components/ui/button";
import { Moment } from "@/components/ui/moment";
import moment from "moment";
import { Link } from "react-router-dom";

interface HistoryProps {
  sessionId: string;
  history: Record<string, Story>;
}

export const History = ({ history, sessionId }: HistoryProps) => {
  const stories = Object.entries(history);

  stories.sort(([, a], [, b]) => {
    if (moment(a.startedAt) < moment(b.startedAt)) {
      return 1;
    }
    if (moment(a.startedAt) > moment(b.startedAt)) {
      return -1;
    }
    return 0;
  });

  if (stories.length === 0) {
    return <div>No stories pointed yet...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">History</h2>
      <ul className="flex flex-col gap-2 list-disc">
        {stories.map(([uid, { endedAt }]) => (
          <li key={uid} className="flex gap-4 max-w-[24ch]">
            <Button variant="link" size="auto" asChild>
              <Link to={`/pointing/${sessionId}/stats/${uid}`}>
                <Moment dateTime={endedAt} />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
