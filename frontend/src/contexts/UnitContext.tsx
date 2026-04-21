import React, { createContext, useContext, useEffect, useState } from 'react';

type Unit = 'celsius' | 'fahrenheit';

interface UnitContextType {
  unit: Unit;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnit] = useState<Unit>(() => {
    const saved = localStorage.getItem('weather_unit');
    return (saved === 'celsius' || saved === 'fahrenheit') ? saved : 'celsius';
  });

  useEffect(() => {
    localStorage.setItem('weather_unit', unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit(prev => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};
