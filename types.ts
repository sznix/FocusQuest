export type QuestStatus = "Backlog" | "Doing" | "Done";

export type QuestDifficulty = "Easy" | "Normal" | "Hard" | "Epic";

export type Quest = {
  id: string;
  title: string;
  description?: string;
  status: QuestStatus;
  difficulty: QuestDifficulty;
  xpReward: number;
};

export type PlayerStats = {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
};
