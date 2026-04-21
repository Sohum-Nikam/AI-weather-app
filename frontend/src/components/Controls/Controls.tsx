import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './Controls.css';

// We strip out UnitContext from here because the prompt said:
// top-right global toggle that switches between Light mode and Dark mode
// inside the card... top-right toggle to switch between Celsius and Fahrenheit

export const Controls: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="controls-container">
      <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
};
