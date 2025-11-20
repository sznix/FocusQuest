import { memo } from "react";
import { Quest, QuestStatus } from "@/types";

type QuestCardProps = {
  quest: Quest;
  onUpdateStatus: (id: string, newStatus: QuestStatus) => void;
  onDelete: (id: string) => void;
};

export const QuestCard = memo(function QuestCard({ quest, onUpdateStatus, onDelete }: QuestCardProps) {
  return (
    <li className="group relative flex flex-col gap-3 rounded-lg border-2 border-slate-700 bg-slate-900/80 p-5 shadow-md transition-all hover:-translate-y-1 hover:border-amber-700/50 hover:shadow-xl hover:shadow-amber-900/20">
      {/* Decorative corner accents */}
      <div className="absolute -top-[2px] -left-[2px] h-2 w-2 border-t-2 border-l-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -top-[2px] -right-[2px] h-2 w-2 border-t-2 border-r-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -bottom-[2px] -left-[2px] h-2 w-2 border-b-2 border-l-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -bottom-[2px] -right-[2px] h-2 w-2 border-b-2 border-r-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />

      <h3 className="text-lg font-serif font-bold text-slate-200 tracking-wide group-hover:text-amber-100">
        {quest.title}
      </h3>

      {quest.description ? (
        <p className="text-sm leading-relaxed text-slate-400 italic">
          &quot;{quest.description}&quot;
        </p>
      ) : null}

      <div className="mt-auto pt-4 flex flex-wrap gap-2 border-t border-slate-800/50">
        {quest.status === "Backlog" ? (
          <button
            type="button"
            onClick={() => onUpdateStatus(quest.id, "Doing")}
            className="flex-1 rounded border border-sky-900/50 bg-sky-950/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 transition hover:bg-sky-900/50 hover:text-sky-200 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]"
          >
            Accept
          </button>
        ) : null}
        {quest.status === "Doing" ? (
          <button
            type="button"
            onClick={() => onUpdateStatus(quest.id, "Done")}
            className="flex-1 rounded border border-emerald-900/50 bg-emerald-950/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-900/50 hover:text-emerald-200 hover:shadow-[0_0_10px_rgba(52,211,153,0.3)]"
          >
            Conquer
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onDelete(quest.id)}
          className="rounded border border-transparent px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 transition hover:text-red-400 hover:bg-red-950/20"
        >
          Abandon
        </button>
      </div>
    </li>
  );
});
