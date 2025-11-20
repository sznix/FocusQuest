export type QuestStatus = "Backlog" | "Doing" | "Done";

export type Quest = {
  id: string;
  title: string;
  description?: string;
  status: QuestStatus;
  xpReward: number;
};

export type PlayerStats = {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
};
