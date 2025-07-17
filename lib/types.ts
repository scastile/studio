

export type Idea = {
  topic: string;
  category: string;
  description: string;
};

export type PinnedIdea = Idea & {
  id: string;
}

export type RelevantDate = {
  date: string;
  reason: string;
};

export type CrossMediaConnection = {
  type: string;
  title: string;
  year: string;
};

export type SavedCampaign = {
  id: string;
  name: string;
  topic: string;
  ideas: Idea[];
  relevantDates: RelevantDate[];
  crossMediaConnections: CrossMediaConnection[];
  createdAt: string;
}

export type SavedImage = {
  id: string;
  prompt: string;
  topic: string;
  url: string;
  createdAt: string;
}

export type GeneratedImage = {
  id: string;
  url: string | null; // null while loading
  prompt: string;
  topic?: string;
}
