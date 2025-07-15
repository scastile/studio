
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
  url: string;
  createdAt: string;
}
