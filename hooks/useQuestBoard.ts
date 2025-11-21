import { useState, useEffect, useCallback, useRef } from "react";
import { Quest, QuestStatus, PlayerStats } from "@/types";

const XP_REWARDS = {
  START_QUEST: 10,
  COMPLETE_QUEST: 50,
};

const BASE_XP_TO_LEVEL = 100;
const XP_SCALING_FACTOR = 1.5;

export function useQuestBoard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    currentXp: 0,
    xpToNextLevel: BASE_XP_TO_LEVEL,
  });

  const [mounted, setMounted] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial state
  useEffect(() => {
    try {
      const storedQuests = localStorage.getItem("focusquest-quests");
      const storedStats = localStorage.getItem("focusquest-stats");

      if (storedQuests) {
        const parsed: unknown = JSON.parse(storedQuests);
        if (Array.isArray(parsed)) {
          // Basic validation would go here, similar to before
          // For brevity, assuming structure is mostly correct but adding defaults
          const validQuests = parsed.map((q: any) => ({
            ...q,
            difficulty: q.difficulty || "Normal",
            xpReward: q.xpReward || XP_REWARDS.COMPLETE_QUEST, // Backfill
          }));
          setQuests(validQuests);
        }
      }

      if (storedStats) {
        setPlayerStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setMounted(true);
    }
  }, []);

  // Persist state
  useEffect(() => {
    if (!mounted) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("focusquest-quests", JSON.stringify(quests));
      localStorage.setItem("focusquest-stats", JSON.stringify(playerStats));
    }, 300);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [quests, playerStats, mounted]);

  const addXp = useCallback((amount: number) => {
    setPlayerStats((prev) => {
      let { level, currentXp, xpToNextLevel } = prev;
      currentXp += amount;

      // Level up logic
      while (currentXp >= xpToNextLevel) {
        currentXp -= xpToNextLevel;
        level += 1;
        xpToNextLevel = Math.floor(xpToNextLevel * XP_SCALING_FACTOR);
        // Optional: Add a toast or sound effect here
      }

      return { level, currentXp, xpToNextLevel };
    });
  }, []);

  const addQuest = useCallback((newQuest: Quest) => {
    setQuests((previous) => [newQuest, ...previous]);
  }, []);

  const updateQuestStatus = useCallback((id: string, newStatus: QuestStatus) => {
    setQuests((previous) => {
      const quest = previous.find((q) => q.id === id);
      if (!quest) return previous;

      // Reward XP for transitions
      if (quest.status === "Backlog" && newStatus === "Doing") {
        addXp(XP_REWARDS.START_QUEST);
      } else if (quest.status === "Doing" && newStatus === "Done") {
        addXp(quest.xpReward || XP_REWARDS.COMPLETE_QUEST);
      }

      return previous.map((q) =>
        q.id === id ? { ...q, status: newStatus } : q
      );
    });
  }, [addXp]);

  const deleteQuest = useCallback((id: string) => {
    setQuests((previous) => previous.filter((quest) => quest.id !== id));
  }, []);

  const updateQuestDetails = useCallback((id: string, updates: Partial<Quest>) => {
    setQuests((previous) =>
      previous.map((quest) =>
        quest.id === id ? { ...quest, ...updates } : quest,
      )
    );
  }, []);

  const replaceQuests = useCallback((updatedQuests: Quest[]) => {
    setQuests(updatedQuests);
  }, []);

  const clearAllQuests = useCallback(() => {
    if (window.confirm("Clear all quests?")) {
      setQuests([]);
    }
  }, []);

  return {
    quests,
    playerStats,
    mounted,
    addQuest,
    updateQuestStatus,
    updateQuestDetails,
    deleteQuest,
    clearAllQuests,
    replaceQuests,
  };
}
