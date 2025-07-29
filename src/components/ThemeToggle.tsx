import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-lg p-1 shadow-lg">
      {(["light", "dark", "system"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`p-2 rounded-md transition-all duration-300 ${
            theme === t
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-110"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          }`}
          title={t === "system" ? "System" : t === "light" ? "Light" : "Dark"}
        >
          {t === "light" ? (
            <Sun className="w-4 h-4" />
          ) : t === "dark" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
} 