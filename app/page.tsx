"use client";

import { useMemo } from "react";
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
    deleteQuest,
    clearAllQuests,
  } = useQuestBoard();

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
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
