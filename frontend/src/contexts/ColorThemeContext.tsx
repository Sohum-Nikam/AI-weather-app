import React, { createContext, useContext, useEffect, useState } from 'react';

export type PresetColor = 'neutral' | 'blue' | 'mint' | 'sand';

interface ColorThemeContextType {
  color: PresetColor;
  setColor: (color: PresetColor) => void;
  accentHex: string;
}

const COLOR_MAPPING: Record<PresetColor, { light: string; dark: string }> = {
  neutral: { light: '#64748b', dark: '#94a3b8' },
  blue: { light: '#3b82f6', dark: '#60a5fa' },
  mint: { light: '#10b981', dark: '#34d399' },
  sand: { light: '#d97706', dark: '#fbbf24' }
};

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const ColorThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState<PresetColor>(() => {
    const saved = localStorage.getItem('app_color');
    return (saved as PresetColor) || 'neutral';
  });

  const [accentHex, setAccentHex] = useState(COLOR_MAPPING[color].light);

  useEffect(() => {
    localStorage.setItem('app_color', color);
    
    // We determine hex based on current doc root state, a basic sync.
    // However, properly doing this means checking if dark mode is active.
    // We can rely on CSS Variables applied globally.
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const hex = isDark ? COLOR_MAPPING[color].dark : COLOR_MAPPING[color].light;
    setAccentHex(hex);
    
    // Apply CSS var directly to root
    document.documentElement.style.setProperty('--theme-accent', hex);
    
  }, [color]);

  // Listen to theme toggles via mutation observer to update the HEX smoothly
  useEffect(() => {
    const observer = new MutationObserver(() => {
       const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
       const hex = isDark ? COLOR_MAPPING[color].dark : COLOR_MAPPING[color].light;
       setAccentHex(hex);
       document.documentElement.style.setProperty('--theme-accent', hex);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [color]);

  return (
    <ColorThemeContext.Provider value={{ color, setColor, accentHex }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};
