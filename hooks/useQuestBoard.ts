import { useState, useEffect, useCallback, useRef } from "react";
import { Quest, QuestStatus, PlayerStats, sanitizeQuestList } from "@/types";

const XP_REWARDS = {
  START_QUEST: 10,
  COMPLETE_QUEST: 50,
};

const BASE_XP_TO_LEVEL = 100;
const XP_INCREMENT_PER_LEVEL = 50;

function calculateXpToNextLevel(level: number) {
  return Math.max(BASE_XP_TO_LEVEL, BASE_XP_TO_LEVEL + (level - 1) * XP_INCREMENT_PER_LEVEL);
}

function launchConfettiBurst() {
  if (typeof window === "undefined") return;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.overflow = "hidden";
  container.style.zIndex = "50";
  document.body.appendChild(container);

  const colors = ["#fbbf24", "#d97706", "#b45309"];
  const particleCount = 80;

  for (let i = 0; i < particleCount; i += 1) {
    const piece = document.createElement("span");
    const size = 6 + Math.random() * 6;
    piece.style.position = "absolute";
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.6}px`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.top = "-8px";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.borderRadius = "2px";
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    container.appendChild(piece);

    const fallDistance = 80 + Math.random() * 60;
    const horizontalDrift = (Math.random() - 0.5) * 120;
    const animation = piece.animate(
      [
        { opacity: 1, transform: piece.style.transform },
        {
          opacity: 0,
          transform: `translate(${horizontalDrift}px, ${fallDistance}px) rotate(${360 * Math.random()}deg)`,
        },
      ],
      {
        duration: 1200 + Math.random() * 600,
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        fill: "forwards",
      },
    );

    animation.onfinish = () => piece.remove();
  }

  window.setTimeout(() => container.remove(), 1800);
}

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
        setQuests(sanitizeQuestList(parsed));
      }

      if (storedStats) {
        const parsedStats: unknown = JSON.parse(storedStats);
        if (parsedStats && typeof parsedStats === "object") {
          const level = Math.max(1, Number((parsedStats as PlayerStats).level) || 1);
          const xpToNextLevel = calculateXpToNextLevel(level);
          const currentXp = Math.min(
            Math.max(0, Number((parsedStats as PlayerStats).currentXp) || 0),
            xpToNextLevel,
          );

          setPlayerStats({ level, currentXp, xpToNextLevel });
        }
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
      let { level, currentXp } = prev;
      let xpToNextLevel = calculateXpToNextLevel(level);
      currentXp += amount;
      let leveledUp = false;

      // Level up logic
      while (currentXp >= xpToNextLevel) {
        currentXp -= xpToNextLevel;
        level += 1;
        xpToNextLevel = calculateXpToNextLevel(level);
        leveledUp = true;
      }

      if (leveledUp) {
        launchConfettiBurst();
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
