import { Button } from "@/components/ui/button";
import { Moment } from "@/components/ui/moment";
import { Link } from "react-router-dom";

interface HistoryProps {
  sessionId: string;
  history: Record<string, Story>;
}

export const History = ({ history, sessionId }: HistoryProps) => {
  if (Object.keys(history).length === 0) {
    return <div>No sessions saved yet...</div>;
  }
  return (
    <div>
      <h2>History</h2>
      <ul className="flex flex-col gap-2 list-disc">
        {Object.entries(history).map(([uid, { startedAt }]) => (
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
