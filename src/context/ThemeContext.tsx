import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export interface FontPairOption {
  id: number;
  name: string;
  heading: string;
  body: string;
  category: string;
  tagline: string;
}

export const FONT_PAIRS: FontPairOption[] = [
  { id: 1, name: 'Manrope + Inter', heading: 'Manrope', body: 'Inter', category: 'Best Overall · SaaS & Modern Agency', tagline: 'Manrope bold, modern headings paired with highly readable Inter body text' },
  { id: 2, name: 'Hanken Grotesk + Inter', heading: 'Hanken Grotesk', body: 'Inter', category: 'Neo-Grotesque Tech', tagline: 'Clean Scandinavian modernist engineering precision' },
  { id: 3, name: 'Space Grotesk + IBM Plex Sans', heading: 'Space Grotesk', body: 'IBM Plex Sans', category: 'Cyber Systems', tagline: 'Monospace/geometric edge paired with engineer ergonomics' },
  { id: 4, name: 'Montserrat + Inter', heading: 'Montserrat', body: 'Inter', category: 'Digital Native SaaS', tagline: 'High-impact geometric display and fluid application text' },
  { id: 5, name: 'Syne + Inter', heading: 'Syne', body: 'Inter', category: 'Sculptural Agency', tagline: 'Sculptural bold grotesque headlines with crisp readable sans' },
  { id: 6, name: 'Epilogue + Inter', heading: 'Epilogue', body: 'Inter', category: 'Architectural Agency', tagline: 'Bold geometric weight balanced by neutral typography' },
  { id: 7, name: 'Poppins + Inter', heading: 'Poppins', body: 'Inter', category: 'Clean Contemporary', tagline: 'Geometric humanist curves for high-conversion web products' },
  { id: 8, name: 'Hanken Grotesk + Space Grotesk', heading: 'Hanken Grotesk', body: 'Space Grotesk', category: 'Next-Gen Enterprise', tagline: 'Sophisticated modern tech aesthetics across headers and copy' },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  fontPair: number;
  setFontPair: (pairId: number) => void;
  activeFontPair: FontPairOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('atideto-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'dark';
  });

  const [fontPair, setFontPairState] = useState<number>(() => {
    const saved = localStorage.getItem('atideto-font-pair');
    const parsed = saved ? parseInt(saved, 10) : 1;
    return parsed >= 1 && parsed <= 8 ? parsed : 1;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('atideto-theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-pair', String(fontPair));
    localStorage.setItem('atideto-font-pair', String(fontPair));
  }, [fontPair]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setFontPair = (pairId: number) => {
    if (pairId >= 1 && pairId <= 8) {
      setFontPairState(pairId);
    }
  };

  const activeFontPair = FONT_PAIRS.find((p) => p.id === fontPair) || FONT_PAIRS[7];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, fontPair, setFontPair, activeFontPair }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
