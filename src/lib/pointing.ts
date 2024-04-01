/**
 * Tools to manage a pointing session.
 */
import { User } from "firebase/auth";
import {
  DocumentSnapshot,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteField,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import moment from "moment";

/**
 * Subscribe to a session.
 * @param firestore The Firestore instance.
 * @param sessionId The session ID.
 * @param callback The callback to call when the session changes.
 * @returns The unsubscribe function.
 */
export const subscribeToSession = (
  firestore: Firestore,
  sessionId: string,
  callback: (snapshot: DocumentSnapshot) => void,
): ReturnType<typeof onSnapshot> => {
  const sessionRef = doc(firestore, `pointing/${sessionId}`);
  return onSnapshot(sessionRef, callback);
};

/**
 * Subscribe to a story.
 * @param firestore The Firestore instance.
 * @param sessionId The session ID.
 * @param storyId The story ID.
 * @param callback The callback to call when the story changes.
 * @returns The unsubscribe function.
 */
export const subscribeToStory = (
  firestore: Firestore,
  sessionId: string,
  storyId: string,
  callback: (snapshot: DocumentSnapshot) => void,
): ReturnType<typeof onSnapshot> => {
  const storyRef = doc(firestore, `pointing/${sessionId}/history/${storyId}`);
  return onSnapshot(storyRef, callback);
};

/**
 * Subscribe to the history of a session.
 * @param firestore The Firestore instance.
 * @param sessionId The session ID.
 * @param callback The callback to call when the history changes.
 * @returns The unsubscribe function.
 */
export const subscribeToHistory = (
  firestore: Firestore,
  sessionId: string,
  callback: (snapshot: QuerySnapshot) => void,
): ReturnType<typeof onSnapshot> => {
  const queryRef = query(
    collection(firestore, `pointing/${sessionId}/history`),
    orderBy("startedAt", "desc"),
    limit(100),
  );
  return onSnapshot(queryRef, callback);
};

/**
 * Create a new session.
 * @param firestore The Firestore instance.
 * @param user The user.
 * @returns A promise with the session ID.
 */
export const create = async (
  firestore: Firestore,
  user: User,
): Promise<string> => {
  const newSession = {
    owner: user.uid,
    currentStory: {
      startedAt: moment().utc().toDate(),
      participants: {},
      observers: {},
      votes: {},
    },
  };
  const sessionRef = await addDoc(
    collection(firestore, "pointing"),
    newSession,
  );
  return sessionRef.id;
};

/**
 * Vote for a story.
 * @param firestore The Firestore instance.
 * @param user The user.
 * @param sessionId The session ID.
 * @param vote The vote.
 */
export const vote = async (
  firestore: Firestore,
  user: User,
  sessionId: string,
  vote: number | "?",
) => {
  const voteData = {
    currentStory: {
      votes: {
        [user.uid]: vote,
      },
    },
  };
  const sessionRef = doc(firestore, `pointing/${sessionId}`);
  await setDoc(sessionRef, voteData, { merge: true });
};

/**
 * Clear the votes for the current story.
 * @param firestore The Firestore instance.
 * @param sessionId The session ID.
 * @param currenStory The current story.
 */
export const clearVotes = async (
  firestore: Firestore,
  sessionId: string,
  currenStory: OpenStory,
) => {
  await addDoc(collection(firestore, `pointing/${sessionId}/history`), {
    ...currenStory,
    endedAt: moment().utc().toDate(),
  });
  await setDoc(
    doc(firestore, `pointing/${sessionId}`),
    {
      currentStory: {
        votes: {},
        startedAt: moment().utc().toDate(),
      },
    },
    { merge: true },
  );
};

/**
 * Kick a user from the session.
 * @param firestore The Firestore instance.
 * @param sesionId The session ID.
 * @param userId The user ID.
 */
export const kick = async (
  firestore: Firestore,
  sesionId: string,
  userId: string,
) => {
  const kicked = {
    currentStory: {
      participants: {
        [userId]: deleteField(),
      },
      observers: {
        [userId]: deleteField(),
      },
    },
  };
  await setDoc(doc(firestore, `pointing/${sesionId}`), kicked, {
    merge: true,
  });
};
