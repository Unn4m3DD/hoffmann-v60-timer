"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TimerDisplay from "@/components/TimerDisplay";
import PhaseTimeline from "@/components/PhaseTimeline";
import ThemeToggle from "@/components/ThemeToggle";
import CoffeeInput from "@/components/CoffeeInput";
import { Slider } from "@/components/ui/slider";

interface Phase {
  id: number;
  time: number; // in seconds
  waterAmount: number;
  cumulativeWater: number;
  description: string;
  endTime: number; // when to stop pouring
}

type Theme = "light" | "dark" | "system";

export default function V60Timer() {
  const [coffeeAmount, setCoffeeAmount] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [theme, setTheme] = useState<Theme>("system");
  const [, setHasFinished] = useState(false);
  const [splitA, setSplitA] = useState<number | null>(null);


  // Calculate phases based on coffee amount
  const calculatePhases = useCallback((coffee: number) => {
    const waterAmount = (coffee * 250) / 15; // 15g coffee to 250g water ratio

    return [
      // Phase 1: Bloom pour (0-15s)
      { 
        id: 0, 
        time: 0, 
        waterAmount: waterAmount * 0.2,
        cumulativeWater: waterAmount * 0.2,
        description: "Bloom pour (0-15s)",
        endTime: 15
      },
      // Phase 2: First rest (15-45s)
      { 
        id: 1, 
        time: 15, 
        waterAmount: 0,
        cumulativeWater: waterAmount * 0.2,
        description: "Rest (15-45s)",
        endTime: 45
      },
      // Phase 3: Second pour (45-60s)
      { 
        id: 2, 
        time: 45, 
        waterAmount: waterAmount * 0.2,
        cumulativeWater: waterAmount * 0.4,
        description: "Second pour (45-60s)",
        endTime: 60
      },
      // Phase 4: Second rest (60-70s)
      { 
        id: 3, 
        time: 60, 
        waterAmount: 0,
        cumulativeWater: waterAmount * 0.4,
        description: "Rest (60-70s)",
        endTime: 70
      },
      // Phase 5: Third pour (70-80s)
      { 
        id: 4, 
        time: 70, 
        waterAmount: waterAmount * 0.2,
        cumulativeWater: waterAmount * 0.6,
        description: "Third pour (70-80s)",
        endTime: 80
      },
      // Phase 6: Third rest (80-90s)
      { 
        id: 5, 
        time: 80, 
        waterAmount: 0,
        cumulativeWater: waterAmount * 0.6,
        description: "Rest (80-90s)",
        endTime: 90
      },
      // Phase 7: Fourth pour (90-100s)
      { 
        id: 6, 
        time: 90, 
        waterAmount: waterAmount * 0.2,
        cumulativeWater: waterAmount * 0.8,
        description: "Fourth pour (90-100s)",
        endTime: 100
      },
      // Phase 8: Fourth rest (100-110s)
      { 
        id: 7, 
        time: 100, 
        waterAmount: 0,
        cumulativeWater: waterAmount * 0.8,
        description: "Rest (100-110s)",
        endTime: 110
      },
      // Phase 9: Final pour (110-120s)
      { 
        id: 8, 
        time: 110, 
        waterAmount: waterAmount * 0.2,
        cumulativeWater: waterAmount,
        description: "Final pour (110-120s)",
        endTime: 120
      },
      // Phase 10: Final rest (120-180s)
      { 
        id: 9, 
        time: 120, 
        waterAmount: 0,
        cumulativeWater: waterAmount,
        description: "Final rest (120-180s)",
        endTime: 180
      },
    ];
  }, []);

  // Update phases when coffee amount changes
  useEffect(() => {
    setPhases(calculatePhases(coffeeAmount));
  }, [coffeeAmount, calculatePhases]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          
          // Check if we need to move to next phase
          const nextPhase = phases.find(phase => phase.time === newTime);
          if (nextPhase && nextPhase.id > currentPhase) {
            setCurrentPhase(nextPhase.id);
          }

          // Stop at 180s (3:00) and mark as finished
          const finalEndTime = 180;
          if (newTime >= finalEndTime) {
            setIsRunning(false);
            setHasFinished(true);
            return finalEndTime;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, phases, currentPhase]);

  // Initialize or clamp split based on coffee amount and expected yield
  useEffect(() => {
    const totalWater = (coffeeAmount * 250) / 15;
    const expectedYield = Math.max(0, Math.round(totalWater - coffeeAmount * 2));
    if (splitA === null) {
      setSplitA(Math.ceil(expectedYield / 2));
      return;
    }
    // Clamp if coffee changed
    const clamped = Math.max(0, Math.min(splitA, expectedYield));
    if (clamped !== splitA) setSplitA(clamped);
  }, [coffeeAmount, splitA]);

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setCurrentTime(0);
    setCurrentPhase(0);
    setHasFinished(false);
    setSplitA(null);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentPhase(0);
    setHasFinished(false);
    setSplitA(null);
  };

  const getCurrentPhase = () => {
    return phases.find(phase => phase.id === currentPhase) || phases[0];
  };

  const getProgress = () => {
    const currentPhaseData = phases[currentPhase];
    if (!currentPhaseData) return 0;
    
    // For the last phase, calculate progress based on endTime
    if (currentPhase >= phases.length - 1) {
      const timeInPhase = currentTime - currentPhaseData.time;
      const phaseDuration = currentPhaseData.endTime - currentPhaseData.time;
      return Math.min((timeInPhase / phaseDuration) * 100, 100);
    }
    
    // For other phases, calculate based on next phase start time
    const nextPhaseData = phases[currentPhase + 1];
    const phaseDuration = nextPhaseData.time - currentPhaseData.time;
    const timeInPhase = currentTime - currentPhaseData.time;
    return Math.min((timeInPhase / phaseDuration) * 100, 100);
  };

  const adjustTime = (seconds: number) => {
    const newTime = Math.max(0, currentTime + seconds);
    setCurrentTime(newTime);
    
    // Update current phase based on new time
    const newPhase = phases.findIndex(phase => phase.time > newTime) - 1;
    if (newPhase >= 0 && newPhase !== currentPhase) {
      setCurrentPhase(Math.max(0, newPhase));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-700 flex justify-center p-2 sm:p-4 pt-2 sm:pt-4 relative overflow-hidden ${
      isRunning ? 'items-start sm:items-start' : 'items-center'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl relative z-10 py-3 sm:py-5">
        <CardHeader className="text-center pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Coffee className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                V60 Timer
              </CardTitle>
            </div>
            
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 sm:space-y-5 pt-0">
          {/* Coffee Input */}
          <CoffeeInput
            coffeeAmount={coffeeAmount}
            setCoffeeAmount={setCoffeeAmount}
            isRunning={isRunning}
          />

          {/* Timer Display with adjustment buttons - Only show when running */}
          <AnimatePresence>
            {isRunning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <TimerDisplay
                  currentTime={currentTime}
                  currentPhase={currentPhase}
                  getProgress={getProgress}
                  formatTime={formatTime}
                  adjustTime={adjustTime}
                  getCurrentPhase={getCurrentPhase}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={pauseTimer}
                  variant="outline"
                  className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 px-6 py-3 transition-all duration-300 shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Phase Timeline - Only show when running */}
          <AnimatePresence>
            {isRunning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              >
                <PhaseTimeline
                  phases={phases}
                  currentPhase={currentPhase}
                  formatTime={formatTime}
                  currentTime={currentTime}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Split Dose - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="rounded-xl p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-slate-800 dark:to-slate-800 border border-purple-200 dark:border-slate-700 shadow-lg"
          >
            {(() => {
              const totalWater = (coffeeAmount * 250) / 15;
              const expectedYield = Math.max(0, Math.round(totalWater - coffeeAmount * 2));
              // Snap per gram of grounds (ml per 1g grounds)
              const yieldPerGram = coffeeAmount > 0 ? expectedYield / coffeeAmount : expectedYield;
              const stepMl = Math.max(1, Math.round(yieldPerGram));
              const defaultA = Math.ceil(expectedYield / 2);
              const rawA = splitA ?? defaultA;
              const snappedA = Math.round(rawA / stepMl) * stepMl;
              const cupA = Math.max(0, Math.min(snappedA, expectedYield));
              const cupB = expectedYield - cupA;
              // Derive grounds split as whole grams linked to step
              const groundsA = Math.max(0, Math.min(coffeeAmount, Math.round(cupA / stepMl)));
              const groundsB = Math.max(0, coffeeAmount - groundsA);
              return (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Coffee grounds</div>
                    <div className="text-sm font-mono font-semibold text-purple-700 dark:text-purple-300">{coffeeAmount} g</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Expected yield</div>
                    <div className="text-sm font-mono font-semibold text-purple-700 dark:text-purple-300">{expectedYield} ml</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Split dose</div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="text-sm font-mono font-semibold text-purple-700 dark:text-purple-300">A: {cupA} ml • B: {cupB} ml</div>
                        <div className="text-xs font-mono text-purple-600 dark:text-purple-400">A: {groundsA} g • B: {groundsB} g</div>
                      </div>
                    </div>
                    <Slider
                      min={0}
                      max={expectedYield}
                      step={stepMl}
                      value={[cupA]}
                      onValueChange={(val: number[]) => setSplitA(val[0])}
                      aria-label="Split dose A"
                    />
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
