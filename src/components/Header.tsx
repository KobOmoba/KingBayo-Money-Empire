import React from 'react';
import { Bot, Sun, Moon, Zap } from 'lucide-react';

interface HeaderProps {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="glass-header sticky top-0 z-10 w-full p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-neon-emerald animate-pulse" />
                <h1 className="text-xl font-bold uppercase tracking-wider text-white">
                    KingBayo <span className="text-neon-emerald">Money Empire</span>
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 p-2 bg-slate-700/50 rounded-lg text-xs font-semibold uppercase text-slate-300">
                    <Bot className="h-4 w-4 text-neon-emerald" />
                    <span>Powered by Gemini</span>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full transition-colors duration-200"
                    aria-label="Toggle Dark/Light Mode"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-6 w-6 text-neon-amber hover:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 text-slate-700 hover:text-black" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
