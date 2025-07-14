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
