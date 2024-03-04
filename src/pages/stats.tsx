import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";

export const StatsPage = () => {
  const { sessionId } = useParams();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="link" size="auto" asChild>
          <Link to={`/pointing/${sessionId}`}>Back</Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold">Stats</h1>
    </div>
  );
};
