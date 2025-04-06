import { useState, useEffect } from 'react';

// Used in Header.jsx
export function useTheme() {
  // Get theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // stores the theme in localStorage and toggles the 'dark' class on the root element if the theme is dark
  // This effect runs every time the theme changes
  useEffect(() => {
    const root = document.documentElement; // Get the root element <html>
    localStorage.setItem('theme', theme); // // Save the theme in localStorage

    // Check if the theme is dark and set the class on the root element else remove it
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark); // Toggle the 'dark' class on the root
  }, [theme]);

  return { theme, setTheme };
}