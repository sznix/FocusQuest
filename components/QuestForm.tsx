import { FormEvent, useCallback, useMemo, useState } from "react";
import { Quest, QuestDifficulty } from "@/types";

type QuestFormProps = {
  onAddQuest: (quest: Quest) => void;
};

export function QuestForm({ onAddQuest }: QuestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("Normal");

  const xpReward = useMemo(() => {
    switch (difficulty) {
      case "Easy":
        return 25;
      case "Hard":
        return 75;
      case "Epic":
        return 120;
      default:
        return 50;
    }
  }, [difficulty]);

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
      difficulty,
      status: "Backlog",
      xpReward,
    };

    onAddQuest(newQuest);
    setTitle("");
    setDescription("");
    setDifficulty("Normal");
  }, [title, description, difficulty, xpReward, onAddQuest]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-900/90 p-6 shadow-2xl transition-all focus-within:border-amber-800/60 focus-within:shadow-amber-900/10"
    >
       {/* Glow effect */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />

      <h2 className="text-xl font-serif font-bold text-amber-500 mb-6 flex items-center gap-2">
        <span className="text-2xl">📜</span> Scribe New Quest
      </h2>

      <div className="grid gap-6 md:grid-cols-[2fr_2fr_2fr_auto] md:items-end">
        <label className="flex flex-col gap-2 group">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors group-focus-within:text-amber-500">
            Quest Title
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Slay the Laundry Dragon"
            required
            className="rounded-lg border-2 border-slate-800 bg-slate-950/60 px-4 py-3 text-base font-medium text-slate-100 outline-none transition-all placeholder:text-slate-700 focus:border-amber-600 focus:bg-slate-950 focus:shadow-[0_0_10px_rgba(217,119,6,0.2)]"
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-1 group">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors group-focus-within:text-amber-500">
            Details <span className="lowercase font-normal opacity-50">(optional)</span>
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the challenge..."
            rows={1}
            className="min-h-[52px] resize-none rounded-lg border-2 border-slate-800 bg-slate-950/60 px-4 py-3 text-base text-slate-100 outline-none transition-all placeholder:text-slate-700 focus:border-amber-600 focus:bg-slate-950 focus:shadow-[0_0_10px_rgba(217,119,6,0.2)]"
          />
        </label>

        <label className="flex flex-col gap-2 group md:col-span-1">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors group-focus-within:text-amber-500">
            Difficulty
          </span>
          <div className="flex gap-3 items-center">
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as QuestDifficulty)}
              className="flex-1 rounded-lg border-2 border-slate-800 bg-slate-950/60 px-4 py-3 text-base font-medium text-slate-100 outline-none transition-all focus:border-amber-600 focus:bg-slate-950 focus:shadow-[0_0_10px_rgba(217,119,6,0.2)]"
            >
              <option value="Easy">Easy</option>
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
              <option value="Epic">Epic</option>
            </select>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 whitespace-nowrap">
              +{xpReward} XP
            </span>
          </div>
        </label>

        <button
          type="submit"
          className="h-[52px] rounded-lg bg-gradient-to-b from-amber-600 to-amber-700 px-8 text-sm font-bold uppercase tracking-widest text-slate-950 shadow-lg shadow-amber-900/40 transition-all hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-600/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          Embark
        </button>
      </div>
    </form>
  );
}
