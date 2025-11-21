import { memo, useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { Quest, QuestStatus } from "@/types";

type QuestCardProps = {
  quest: Quest;
  onUpdateStatus: (id: string, newStatus: QuestStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Quest>) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
};

export const QuestCard = memo(function QuestCard({
  quest,
  onUpdateStatus,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnd,
}: QuestCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(quest.title);
  const [editedDescription, setEditedDescription] = useState(quest.description ?? "");

  const difficultyColors = useMemo(() => {
    switch (quest.difficulty) {
      case "Easy":
        return "border-emerald-500/60 text-emerald-300";
      case "Hard":
        return "border-orange-500/70 text-orange-300";
      case "Epic":
        return "border-fuchsia-500 text-fuchsia-200";
      default:
        return "border-sky-500/60 text-sky-200";
    }
  }, [quest.difficulty]);

  const handleSave = useCallback(() => {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) return;

    onEdit(quest.id, {
      title: trimmedTitle,
      description: editedDescription.trim() ? editedDescription.trim() : undefined,
    });
    setIsEditing(false);
  }, [editedTitle, editedDescription, onEdit, quest.id]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSave();
      }

      if (event.key === "Escape") {
        setIsEditing(false);
        setEditedTitle(quest.title);
        setEditedDescription(quest.description ?? "");
      }
    },
    [handleSave, quest.description, quest.title],
  );

  if (isEditing) {
    return (
      <li className="group relative flex flex-col gap-3 rounded-lg border-2 border-amber-700/60 bg-slate-950/80 p-5 shadow-md">
        <div className="flex flex-col gap-3">
          <input
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="rounded border-2 border-amber-700/50 bg-slate-900/80 px-3 py-2 text-base font-semibold text-slate-100 outline-none focus:border-amber-500"
          />
          <textarea
            value={editedDescription}
            onChange={(event) => setEditedDescription(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add more detail..."
            className="min-h-[70px] rounded border-2 border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-500"
          />
        </div>
        <div className="mt-auto flex gap-2 pt-3 border-t border-slate-800/50">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded border border-emerald-700/60 bg-emerald-950/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200 transition hover:bg-emerald-900/60"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditedTitle(quest.title);
              setEditedDescription(quest.description ?? "");
            }}
            className="rounded border border-slate-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      draggable
      onDragStart={() => onDragStart(quest.id)}
      onDragEnd={onDragEnd}
      className="group relative flex flex-col gap-3 rounded-lg border-2 border-slate-700 bg-slate-900/80 p-5 shadow-md transition-all hover:-translate-y-1 hover:border-amber-700/50 hover:shadow-xl hover:shadow-amber-900/20"
    >
      {/* Decorative corner accents */}
      <div className="absolute -top-[2px] -left-[2px] h-2 w-2 border-t-2 border-l-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -top-[2px] -right-[2px] h-2 w-2 border-t-2 border-r-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -bottom-[2px] -left-[2px] h-2 w-2 border-b-2 border-l-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -bottom-[2px] -right-[2px] h-2 w-2 border-b-2 border-r-2 border-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-serif font-bold text-slate-200 tracking-wide group-hover:text-amber-100">
          {quest.title}
        </h3>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${difficultyColors}`}>
          {quest.difficulty}
        </span>
      </div>

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
          onClick={() => setIsEditing(true)}
          className="rounded border border-amber-800/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 transition hover:border-amber-500 hover:text-amber-100"
        >
          Edit
        </button>
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
