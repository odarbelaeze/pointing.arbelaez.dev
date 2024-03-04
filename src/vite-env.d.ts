/// <reference types="vite/client" />

type Story = {
  description: string;
  startedAt: string;
  endedAt: string;
  participants: { [uid: string]: { name: string } };
  votes: { [uid: string]: number | "?" };
};

type OpenStory = Omit<Story, "endedAt">;

type PointingSession = {
  currentStory: OpenStory;
  history: Story[];
};
