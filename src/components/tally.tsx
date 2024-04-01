import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { deleteField, doc, setDoc } from "firebase/firestore";
import { RxCheck, RxExit } from "react-icons/rx";
import { useAsyncFn } from "react-use";

interface TallyProps {
  sessionId: string;
  story: OpenStory;
}

export const Tally = ({ sessionId, story }: TallyProps) => {
  const { user, firestore } = useFirebase();
  const allVoted = Object.keys(story.participants || {}).every(
    (uid) => story.votes && !!story.votes[uid],
  );
  const participants = Object.entries(story.participants || {});
  const observers = Object.entries(story.observers || {});
  const [kickState, kick] = useAsyncFn(
    async (uid: string) => {
      const kicked = {
        currentStory: {
          participants: {
            [uid]: deleteField(),
          },
        },
      };
      await setDoc(doc(firestore, `pointing/${sessionId}`), kicked, {
        merge: true,
      });
    },
    [firestore, sessionId],
  );
  if (!user || user === "loading") {
    return null;
  }
  return (
    <div className="flex flex-col gap-4">
      {participants.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Participants</h2>
          <ul className="flex flex-col gap-2">
            {participants.map(([uid, { name }]) => (
              <li
                key={uid}
                className="flex gap-4 items-center justify-between max-w-[24ch]"
              >
                <div className="flex items-center gap-1 flex-grow">
                  {story.votes && !!story.votes[uid] && <RxCheck />}
                  <span
                    title={name}
                    className="whitespace-nowrap overflow-hidden overflow-ellipsis flex-grow"
                  >
                    {name}
                  </span>
                  {user.uid !== uid && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => kick(uid)}
                      disabled={kickState.loading}
                    >
                      <RxExit title="kick" aria-label="kick" />
                    </Button>
                  )}
                </div>
                {allVoted ||
                (story.votes && story.votes[uid] && uid === user.uid) ? (
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
        </>
      )}
      {observers.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Observers</h2>
          <ul className="flex flex-col gap-2">
            {observers.map(([uid, { name }]) => (
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
