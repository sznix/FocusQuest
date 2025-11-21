import { memo, useMemo, useState, useCallback, type DragEvent } from "react";
import { Quest, QuestStatus } from "@/types";
import { QuestCard } from "./QuestCard";
import { useListAutoAnimate } from "@/hooks/useListAutoAnimate";

type QuestColumnProps = {
  column: QuestStatus;
  quests: Quest[];
  onUpdateStatus: (id: string, newStatus: QuestStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Quest>) => void;
  onDropQuest: (column: QuestStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
};

export const QuestColumn = memo(function QuestColumn({
  column,
  quests,
  onUpdateStatus,
  onDelete,
  onEdit,
  onDropQuest,
  onDragStart,
  onDragEnd,
}: QuestColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [listRef] = useListAutoAnimate<HTMLUListElement>();

  const questsInColumn = useMemo(() => {
    return quests.filter((quest) => quest.status === column);
  }, [quests, column]);

  const columnTitle = useMemo(() => {
    switch (column) {
      case "Backlog": return "Quest Board";
      case "Doing": return "Current Adventure";
      case "Done": return "Conquered Legends";
    }
  }, [column]);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    onDropQuest(column);
  }, [column, onDropQuest]);

  return (
    <article
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-xl border-2 bg-slate-950/80 shadow-2xl shadow-black overflow-hidden transition ${
        isDragOver ? "border-amber-600/70 shadow-amber-900/40" : "border-slate-800"
      }`}
    >
      <header className="border-b-2 border-slate-800 bg-slate-900/90 px-5 py-4 text-center">
        <h2 className="text-lg font-serif font-bold tracking-widest uppercase text-amber-500/90 drop-shadow-sm">
          {columnTitle}
        </h2>
        <div className="mt-1 h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
      </header>

      <div className="flex-1 p-4 space-y-4 min-h-[200px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {questsInColumn.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-slate-600 opacity-60">
             {/* Optional: Add an SVG icon here for empty state */}
            <p className="text-sm font-serif italic">
              The scroll is blank...
            </p>
          </div>
        ) : (
          <ul ref={listRef} className="space-y-4 transition-all duration-300">
            {questsInColumn.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                onEdit={onEdit}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
});
