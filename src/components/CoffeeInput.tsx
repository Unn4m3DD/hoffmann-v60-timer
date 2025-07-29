import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CoffeeInputProps {
  coffeeAmount: number;
  setCoffeeAmount: (amount: number) => void;
  isRunning: boolean;
}

export default function CoffeeInput({ 
  coffeeAmount, 
  setCoffeeAmount, 
  isRunning 
}: CoffeeInputProps) {
  const totalWater = (coffeeAmount * 250) / 15; // 15g coffee to 250g water ratio

  const adjustCoffee = (grams: number) => {
    const newAmount = Math.max(1, coffeeAmount + grams);
    setCoffeeAmount(newAmount);
  };

  // Only show when timer is not running
  if (isRunning) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => adjustCoffee(-1)}
          variant="outline"
          size="sm"
          className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-300 shadow-lg w-10 h-10 rounded-full"
          disabled={coffeeAmount <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <div className="text-center">
          <motion.div
            key={coffeeAmount}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            {coffeeAmount}g
          </motion.div>
          <motion.div
            key={totalWater.toFixed(0)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="text-xs text-purple-600 dark:text-purple-400"
          >
            {totalWater.toFixed(0)}g water
          </motion.div>
        </div>
        
        <Button
          onClick={() => adjustCoffee(1)}
          variant="outline"
          size="sm"
          className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-300 shadow-lg w-10 h-10 rounded-full"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
} 