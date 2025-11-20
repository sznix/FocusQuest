"use client";

import { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type QuestStatus = "Backlog" | "Doing" | "Done";

type Quest = {
  id: string;
  title: string;
  description?: string;
  status: QuestStatus;
};

const questColumns: QuestStatus[] = ["Backlog", "Doing", "Done"];

type QuestCardProps = {
  quest: Quest;
  onUpdateStatus: (id: string, newStatus: QuestStatus) => void;
  onDelete: (id: string) => void;
};

const QuestCard = memo(function QuestCard({ quest, onUpdateStatus, onDelete }: QuestCardProps) {
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <h3 className="text-base font-semibold text-slate-100">{quest.title}</h3>
      {quest.description ? (
        <p className="mt-2 text-sm text-slate-400">{quest.description}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        {quest.status === "Backlog" ? (
          <button
            type="button"
            onClick={() => onUpdateStatus(quest.id, "Doing")}
            className="rounded-md bg-sky-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Start
          </button>
        ) : null}
        {quest.status === "Doing" ? (
          <button
            type="button"
            onClick={() => onUpdateStatus(quest.id, "Done")}
            className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Complete
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onDelete(quest.id)}
          className="rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/70 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Delete
        </button>
      </div>
    </li>
  );
});

type QuestColumnProps = {
  column: QuestStatus;
  quests: Quest[];
  onUpdateStatus: (id: string, newStatus: QuestStatus) => void;
  onDelete: (id: string) => void;
};

const QuestColumn = memo(function QuestColumn({ column, quests, onUpdateStatus, onDelete }: QuestColumnProps) {
  const questsInColumn = useMemo(() => {
    return quests.filter((quest) => quest.status === column);
  }, [quests, column]);

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-slate-950/40">
      <header className="border-b border-slate-800 px-5 py-3">
        <h2 className="text-lg font-medium tracking-wide uppercase">
          {column}
        </h2>
      </header>

      <div className="p-5 space-y-4">
        {questsInColumn.length === 0 ? (
          <p className="text-sm text-slate-400">
            No quests here yet. Add one above to get started!
          </p>
        ) : (
          <ul className="space-y-4">
            {questsInColumn.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
});

export default function HomePage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mounted, setMounted] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const storedQuests = localStorage.getItem("focusquest-quests");

      if (!storedQuests) {
        setMounted(true);
        return;
      }

      const parsed: unknown = JSON.parse(storedQuests);

      if (Array.isArray(parsed)) {
        const validQuests: Quest[] = parsed.filter((item): item is Quest => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const maybeQuest = item as Partial<Quest>;
          const hasValidStatus =
            maybeQuest.status === "Backlog" ||
            maybeQuest.status === "Doing" ||
            maybeQuest.status === "Done";

          const hasRequiredFields =
            typeof maybeQuest.id === "string" &&
            typeof maybeQuest.title === "string" &&
            hasValidStatus;

          if (!hasValidStatus) {
            return false;
          }

          if (
            maybeQuest.description !== undefined &&
            typeof maybeQuest.description !== "string"
          ) {
            return false;
          }

          return hasRequiredFields;
        });

        if (validQuests.length) {
          setQuests(validQuests);
        }
      }
    } catch (error) {
      console.error("Failed to parse quests from localStorage", error);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("focusquest-quests", JSON.stringify(quests));
      } catch (error) {
        console.error("Failed to save quests to localStorage", error);
      }
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [quests, mounted]);

  const updateQuestStatus = useCallback((id: string, newStatus: QuestStatus) => {
    setQuests((previous) =>
      previous.map((quest) =>
        quest.id === id
          ? {
              ...quest,
              status: newStatus,
            }
          : quest,
      ),
    );
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setQuests((previous) => previous.filter((quest) => quest.id !== id));
  }, []);

  const clearAllQuests = () => {
    const shouldClear = window.confirm(
      "Clear all quests? This will remove every quest from the board.",
    );

    if (!shouldClear) {
      return;
    }

    setQuests([]);
  };

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return;
    }

    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: trimmedDescription ? trimmedDescription : undefined,
      status: "Backlog",
    };

    setQuests((previous) => [newQuest, ...previous]);
    setTitle("");
    setDescription("");
  }, [title, description]);

  const questCounts = useMemo(() => {
    return quests.reduce(
      (counts, quest) => {
        if (quest.status === "Backlog") {
          counts.backlog += 1;
        } else if (quest.status === "Doing") {
          counts.doing += 1;
        } else if (quest.status === "Done") {
          counts.done += 1;
        }

        return counts;
      },
      { backlog: 0, doing: 0, done: 0 },
    );
  }, [quests]);

  const totalQuests = quests.length;
  const allQuestsComplete = totalQuests > 0 && questCounts.done === totalQuests;
  const summaryLine = useMemo(
    () =>
      totalQuests === 0
        ? "No quests yet. Create your first quest to get rolling."
        : `${totalQuests} quests total · ${questCounts.backlog} Backlog · ${questCounts.doing} Doing · ${questCounts.done} Done${
            allQuestsComplete ? " · All quests complete! 🎉" : ""
          }`,
    [totalQuests, questCounts, allQuestsComplete]
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
        <h1 className="text-3xl font-semibold text-center">FocusQuest</h1>
        <div className="mt-3 mb-10 flex flex-col items-center gap-3 text-sm text-slate-400">
          <p className="text-center">Loading your quests...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <h1 className="text-3xl font-semibold text-center">FocusQuest</h1>
      <div className="mt-3 mb-10 flex flex-col items-center gap-3 text-sm text-slate-400">
        <p className="text-center">{summaryLine}</p>
        {totalQuests > 0 ? (
          <button
            type="button"
            onClick={clearAllQuests}
            className="rounded-md border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/70 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Clear all quests
          </button>
        ) : null}
      </div>

      <section className="max-w-5xl mx-auto space-y-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40"
        >
          <h2 className="text-xl font-semibold mb-4">Add a new quest</h2>

          <div className="grid gap-4 md:grid-cols-[2fr_3fr_auto] md:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-wide text-slate-400">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Review study notes"
                required
                className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-base text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-1">
              <span className="text-sm uppercase tracking-wide text-slate-400">
                Description <span className="lowercase text-slate-500">(optional)</span>
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add context or steps to get rolling"
                rows={3}
                className="resize-none rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-base text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
              />
            </label>

            <button
              type="submit"
              className="h-12 rounded-lg bg-sky-500 px-6 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Add Quest
            </button>
          </div>
        </form>

        <div className="grid gap-6 md:grid-cols-3">
          {questColumns.map((column) => {
            return (
              <QuestColumn
                key={column}
                column={column}
                quests={quests}
                onUpdateStatus={updateQuestStatus}
                onDelete={deleteQuest}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
