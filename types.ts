export const QUEST_STATUSES = ["Backlog", "Doing", "Done"] as const;
export type QuestStatus = (typeof QUEST_STATUSES)[number];

export const QUEST_DIFFICULTIES = ["Easy", "Normal", "Hard", "Epic"] as const;
export type QuestDifficulty = (typeof QUEST_DIFFICULTIES)[number];

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

export function sanitizeQuest(raw: unknown): Quest | null {
  if (!raw || typeof raw !== "object") return null;

  const quest = raw as Partial<Record<keyof Quest, unknown>>;

  if (!quest.id || !quest.title) return null;

  const status = QUEST_STATUSES.includes(quest.status as QuestStatus)
    ? (quest.status as QuestStatus)
    : "Backlog";

  const difficulty = QUEST_DIFFICULTIES.includes(quest.difficulty as QuestDifficulty)
    ? (quest.difficulty as QuestDifficulty)
    : "Normal";

  const xpReward = typeof quest.xpReward === "number" && Number.isFinite(quest.xpReward)
    ? quest.xpReward
    : 50;

  return {
    id: String(quest.id),
    title: String(quest.title),
    description: quest.description ? String(quest.description) : undefined,
    status,
    difficulty,
    xpReward,
  };
}

export function sanitizeQuestList(raw: unknown): Quest[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => sanitizeQuest(item))
    .filter((quest): quest is Quest => Boolean(quest));
}
