
import React from 'react';
import { Menu, Zap, Sun, Moon, LogIn } from 'lucide-react';
import { AppMode } from './types'; // Corrected path

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 shadow-md dark:shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            KingBayo Money Empire
          </h1>
        </div>

        {/* Controls and Theme Toggle */}
        <div className="flex items-center space-x-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 bg-slate-100 dark:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User/Login Placeholder (Optional) */}
          <button
            className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Connect Warlord
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
