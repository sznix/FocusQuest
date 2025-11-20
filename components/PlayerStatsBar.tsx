import { memo } from "react";
import { PlayerStats } from "@/types";

type PlayerStatsBarProps = {
  stats: PlayerStats;
};

export const PlayerStatsBar = memo(function PlayerStatsBar({ stats }: PlayerStatsBarProps) {
  const progressPercentage = Math.min(
    100,
    Math.max(0, (stats.currentXp / stats.xpToNextLevel) * 100)
  );

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 p-4 rounded-xl border-2 border-amber-700/50 bg-slate-900/80 shadow-[0_0_15px_rgba(180,83,9,0.2)]">
      <div className="flex justify-between items-end mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 border-2 border-amber-300 text-slate-950 font-bold text-lg shadow-lg">
            {stats.level}
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
              Level
            </span>
            <span className="text-sm text-amber-100 font-medium">
              Adventurer
            </span>
          </div>
        </div>
        <div className="text-xs font-mono text-amber-400/80">
          XP: {stats.currentXp} / {stats.xpToNextLevel}
        </div>
      </div>

      <div className="relative h-4 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
        {/* Background pattern/glow */}
        <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            style={{ width: `${progressPercentage}%` }}
        >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDFmgjEgejEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-30"></div>
        </div>
      </div>
    </div>
  );
});
