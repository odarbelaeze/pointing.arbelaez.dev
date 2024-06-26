/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: string;
  readonly VITE_USE_EMULATORS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Story = {
  startedAt?: Date;
  endedAt?: Date;
  participants?: Record<string, { name: string }>;
  observers?: Record<string, { name: string }>;
  votes?: Record<string, number | "?">;
};

type OpenStory = Omit<Story, "endedAt">;

type PointingSession = {
  owner: string;
  currentStory: OpenStory;
  history: Record<string, Story>;
};
