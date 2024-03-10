import moment from "moment";

interface StatsProps {
  story: Story;
}

export const Stats = ({ story }: StatsProps) => {
  const votes = Object.values(story.votes || {});
  const numericVotes = votes.filter((v) => v !== "?") as number[];
  const average =
    numericVotes.reduce((acc, x) => acc + x, 0) / numericVotes.length;
  const consensus = votes.every((v) => v === votes[0] && v !== "?");
  const voteFrequency = Object.values(story.votes || {}).reduce(
    (acc: { [key: number]: number }, v) => ({
      ...acc,
      [v]: (acc[v as number] || 0) + 1,
    }),
    {},
  );
  return (
    <div className="flex flex-col gap-2 min-w-52">
      <div className="flex justify-between gap-2">
        <span>Time taken</span>{" "}
        <span>
          {moment
            .duration(moment(story.endedAt).diff(moment(story.startedAt)))
            .humanize()}
        </span>
      </div>
      <div className="flex justify-between gap-2">
        <span>Average</span>
        <span>{average}</span>
      </div>
      <div className="flex justify-between gap-2">
        <strong>Points</strong>
        <strong>Votes</strong>
      </div>
      {Object.entries(voteFrequency).map(([uid, vote]) => (
        <div key={uid} className="flex justify-between gap-2">
          <span>{uid}</span>
          <span>{vote as number}</span>
        </div>
      ))}
      {consensus && <div className="text-primary text-center">Consensus!</div>}
    </div>
  );
};
