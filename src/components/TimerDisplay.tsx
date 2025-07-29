import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface TimerDisplayProps {
  currentTime: number;
  currentPhase: number;
  getProgress: () => number;
  formatTime: (seconds: number) => string;
  adjustTime: (seconds: number) => void;
  getCurrentPhase: () =>
    | { cumulativeWater: number; description: string }
    | undefined;
}

export default function TimerDisplay({
  currentTime,
  currentPhase,
  getProgress,
  formatTime,
  adjustTime,
  getCurrentPhase,
}: TimerDisplayProps) {
  return (
    <div className="text-center space-y-4">
      <div className="relative">
        {/* Progress Ring */}
        <div className="w-48 h-48 mx-auto relative">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(139, 92, 246, 0.2)"
              className="dark:stroke-purple-900"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${
                2 * Math.PI * 45 * (1 - getProgress() / 100)
              }`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">
              Phase {currentPhase + 1} of 10
            </div>
            <motion.div
              key={getCurrentPhase()?.cumulativeWater.toFixed(0)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-xs text-purple-500 dark:text-purple-400 mt-1"
            >
              {getCurrentPhase()?.cumulativeWater.toFixed(0)}g
            </motion.div>
          </div>

          {/* Time Adjustment Buttons - Positioned around the clock */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-12">
            <Button
              onClick={() => adjustTime(-5)}
              variant="outline"
              size="sm"
              className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-300 shadow-lg w-10 h-10 rounded-full"
              disabled={currentTime < 5}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-12">
            <Button
              onClick={() => adjustTime(5)}
              variant="outline"
              size="sm"
              className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-300 shadow-lg w-10 h-10 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
