/// <reference types="vite/client" />

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
