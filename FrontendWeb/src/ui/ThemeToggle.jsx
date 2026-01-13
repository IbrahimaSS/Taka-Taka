import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primaryBlue-start focus:ring-offset-2"
      aria-label={`Basculer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      <span className="sr-only">Basculer le thème</span>

      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
        }`}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          {theme === 'light' ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : (
            <Moon className="h-4 w-4 text-blue-400" />
          )}
        </span>
      </span>
    </button>
  );
}
