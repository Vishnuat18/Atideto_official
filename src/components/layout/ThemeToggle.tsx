import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { applyThemeTransition, syncThemeMeta } from '@/lib/smoothTheme';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    syncThemeMeta(isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    syncThemeMeta(nextDark);
    applyThemeTransition();
    setTheme(nextDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <span className="transition-transform duration-300 absolute">
        {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
      </span>
    </button>
  );
}
