import { useState, useEffect } from 'react';

// Used in Settings.jsx
export function useTheme() {
  // Get theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement; // Get the root element <html>
    localStorage.setItem('theme', theme); // // Save the theme in localStorage

    // Check if the theme is dark and set the class on the root element else remove it
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark); // Toggle the 'dark' class on the root
  }, [theme]);

  return { theme, setTheme };
}