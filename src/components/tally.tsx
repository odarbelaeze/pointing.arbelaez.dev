import { useFirebase } from "@/hooks/firebase";
import { RxCheck } from "react-icons/rx";

interface TallyProps {
  story: OpenStory;
}

export const Tally = ({ story }: TallyProps) => {
  const { user } = useFirebase();
  const allVoted = Object.keys(story.participants || {}).every(
    (uid) => story.votes && !!story.votes[uid],
  );
  if (!user || user === "loading") {
    return null;
  }
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Participants</h2>
      <ul className="flex flex-col gap-2">
        {Object.entries(story.participants || {}).map(([uid, { name }]) => (
          <li
            key={uid}
            className="flex gap-4 items-center justify-between max-w-[24ch]"
          >
            <div className="flex items-center gap-1">
              {story.votes && !!story.votes[uid] && <RxCheck />}
              <span
                title={name}
                className="whitespace-nowrap overflow-hidden overflow-ellipsis"
              >
                {name}
              </span>
            </div>
            {allVoted || story.votes && story.votes[uid] && uid === user.uid ? (
              <span>{story.votes && story.votes[uid]}</span>
            ) : (
              <div
                className="flex-shrink-0 bg-foreground w-8 h-4 rounded-md"
                aria-label="hidden vote"
              />
            )}
          </li>
        ))}
      </ul>
      {Object.entries(story.observers || {}).length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Observers</h2>
          <ul className="flex flex-col gap-2">
            {Object.entries(story.observers || {}).map(([uid, { name }]) => (
              <li
                key={uid}
                className="flex gap-4 items-center justify-between max-w-[24ch]"
              >
                <span
                  title={name}
                  className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                >
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
