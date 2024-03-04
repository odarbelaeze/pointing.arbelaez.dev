import { Button } from "@/components/ui/button";

interface BallotProps {
  onVote: (vote: number | "?") => void;
}

export const Ballot = ({ onVote }: BallotProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {([1, 2, 3, 5, 8, 13, 21, 34, "?"] as (number | "?")[]).map((i) => (
        <Button key={i} onClick={() => onVote(i)}>
          {i}
        </Button>
      ))}
    </div>
  );
};
