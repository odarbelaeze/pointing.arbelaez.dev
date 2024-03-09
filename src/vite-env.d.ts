/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Story = {
  description: string;
  startedAt: string;
  endedAt: string;
  participants: Record<string, { name: string }>;
  votes: Record<string, number | "?">;
};

type OpenStory = Omit<Story, "endedAt">;

type PointingSession = {
  currentStory: OpenStory;
  history: Record<string, Story>;
};
