"use client";

import { useCallback, useMemo, useRef, useState, type ChangeEvent } from "react";
import { QuestStatus } from "@/types";
import { QuestColumn } from "@/components/QuestColumn";
import { QuestForm } from "@/components/QuestForm";
import { PlayerStatsBar } from "@/components/PlayerStatsBar";
import { useQuestBoard } from "@/hooks/useQuestBoard";

const questColumns: QuestStatus[] = ["Backlog", "Doing", "Done"];

export default function HomePage() {
  const {
    quests,
    playerStats,
    mounted,
    addQuest,
    updateQuestStatus,
    updateQuestDetails,
    deleteQuest,
    clearAllQuests,
    replaceQuests,
  } = useQuestBoard();

  const [draggingQuestId, setDraggingQuestId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        ? "The quest log is empty. Adventure awaits!"
        : `${totalQuests} quests active · ${questCounts.backlog} Queued · ${questCounts.doing} Active · ${questCounts.done} Complete${
            allQuestsComplete ? " · Glorious Victory! 🎉" : ""
          }`,
    [totalQuests, questCounts, allQuestsComplete]
  );

  const handleDragStart = useCallback((id: string) => {
    setDraggingQuestId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingQuestId(null);
  }, []);

  const handleDrop = useCallback(
    (column: QuestStatus) => {
      if (!draggingQuestId) return;

      const quest = quests.find((q) => q.id === draggingQuestId);
      if (quest && quest.status !== column) {
        updateQuestStatus(draggingQuestId, column);
      }
      setDraggingQuestId(null);
    },
    [draggingQuestId, quests, updateQuestStatus],
  );

  const handleEditQuest = useCallback(
    (id: string, updates: Partial<typeof quests[number]>) => {
      updateQuestDetails(id, updates);
    },
    [updateQuestDetails],
  );

  const handleExport = useCallback(() => {
    const data = JSON.stringify(quests, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "focusquest-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [quests]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImport = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (!Array.isArray(parsed)) return;

          const validStatuses: QuestStatus[] = ["Backlog", "Doing", "Done"];
          const validDifficulties = ["Easy", "Normal", "Hard", "Epic"] as const;

          const sanitized = parsed
            .map((quest: any) => {
              if (!quest?.id || !quest?.title) return null;
              const status = validStatuses.includes(quest.status) ? quest.status : "Backlog";
              const difficulty = validDifficulties.includes(quest.difficulty) ? quest.difficulty : "Normal";

              return {
                id: String(quest.id),
                title: String(quest.title),
                description: quest.description ? String(quest.description) : undefined,
                status,
                difficulty,
                xpReward: typeof quest.xpReward === "number" ? quest.xpReward : 50,
              };
            })
            .filter(Boolean);

          if (sanitized.length > 0) {
            replaceQuests(sanitized as typeof quests);
          }
        } catch (error) {
          console.error("Import failed", error);
        } finally {
          event.target.value = "";
        }
      };

      reader.readAsText(file);
    },
    [replaceQuests],
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-amber-600" />
          <p className="text-center text-amber-500/80 font-serif animate-pulse">Summoning the Quest Board...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 py-12 px-4 sm:px-6 relative overflow-x-hidden">
       {/* Background Ambience */}
       <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#0b0f19] to-[#020617] -z-10" />

      <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-lg mb-2">
        FocusQuest
      </h1>

      <div className="mt-2 mb-8 flex flex-col items-center gap-4 text-sm text-slate-400">
        <p className="text-center font-medium text-slate-500">{summaryLine}</p>
        {totalQuests > 0 ? (
          <button
            type="button"
            onClick={clearAllQuests}
            className="text-xs font-bold uppercase tracking-widest text-slate-600 transition hover:text-red-400"
          >
            Abandon All Quests
          </button>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="rounded border border-amber-800/40 bg-amber-900/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-amber-200 transition hover:border-amber-600 hover:text-amber-100"
          >
            Export Quests
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded border border-sky-800/40 bg-sky-900/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-sky-200 transition hover:border-sky-500 hover:text-sky-50"
          >
            Import Quests
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      <section className="max-w-6xl mx-auto space-y-10">

        <PlayerStatsBar stats={playerStats} />

        <QuestForm onAddQuest={addQuest} />

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {questColumns.map((column) => {
            return (
              <QuestColumn
                key={column}
                column={column}
                quests={quests}
                onUpdateStatus={updateQuestStatus}
                onDelete={deleteQuest}
                onEdit={handleEditQuest}
                onDropQuest={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
