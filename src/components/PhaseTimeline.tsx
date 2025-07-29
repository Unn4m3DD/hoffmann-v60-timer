import { Label } from "@/components/ui/label";

interface Phase {
  id: number;
  time: number;
  waterAmount: number;
  cumulativeWater: number;
  description: string;
  endTime: number;
}

interface PhaseTimelineProps {
  phases: Phase[];
  currentPhase: number;
  formatTime: (seconds: number) => string;
}

export default function PhaseTimeline({
  phases,
  currentPhase,
  formatTime,
  currentTime,
}: PhaseTimelineProps & { currentTime: number }) {
  // Filter phases to show only current and future phases
  const visiblePhases = phases.filter((phase, index) => index >= currentPhase);

  return (
    <div className="space-y-2">
      <Label className="text-purple-700 dark:text-purple-300 font-medium">Timeline</Label>
      <div className="space-y-2">
        {visiblePhases.map((phase, index) => {
          const isActive = index === 0; // First visible phase is always active
          const isFuture = index > 0; // Other phases are future
          const isInPourWindow = currentTime >= phase.time && currentTime <= phase.endTime;
          
          return (
            <div
              key={phase.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 shadow-lg ${
                isActive && isInPourWindow
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 border-2 border-green-400 dark:border-green-500 scale-105 shadow-xl"
                  : isActive
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 border-2 border-purple-400 dark:border-purple-500 scale-105 shadow-xl"
                  : isFuture
                  ? "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-800 border border-gray-300 dark:border-slate-600"
                  : "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-800 border border-gray-300 dark:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isActive && isInPourWindow
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse shadow-lg"
                    : isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse shadow-lg"
                    : isFuture
                    ? "bg-gradient-to-r from-gray-400 to-slate-400"
                    : "bg-gradient-to-r from-gray-400 to-slate-400"
                }`} />
                <span className={`font-medium ${
                  isActive && isInPourWindow
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                    : isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    : isFuture
                    ? "text-gray-600 dark:text-gray-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {phase.description.replace(/\([^)]*\)/g, '').trim()}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-mono font-bold ${
                  isActive && isInPourWindow
                    ? "text-green-700 dark:text-green-300"
                    : isActive
                    ? "text-purple-700 dark:text-purple-300"
                    : isFuture
                    ? "text-gray-600 dark:text-gray-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {formatTime(phase.time)} - {formatTime(phase.endTime)}
                </div>
                <div className={`text-xs font-mono ${
                  isActive && isInPourWindow
                    ? "text-green-600 dark:text-green-400"
                    : isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : isFuture
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                  {phase.cumulativeWater.toFixed(0)}g
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 