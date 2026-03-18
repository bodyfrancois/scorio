import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from './colors';

export type Language = 'fr' | 'en';

type ThemeContextType = {
  isDark: boolean;
  toggleDark: () => void;
  colors: typeof lightColors;
  language: Language;
  setLanguage: (lang: Language) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleDark: () => {},
  colors: lightColors,
  language: 'fr',
  setLanguage: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    AsyncStorage.multiGet(['isDark', 'language']).then((pairs) => {
      if (pairs[0][1] === 'true') setIsDark(true);
      if (pairs[1][1] === 'en') setLanguageState('en');
    });
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem('isDark', String(next));
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem('language', lang);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDark,
        colors: isDark ? darkColors : lightColors,
        language,
        setLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
