import React from 'react';
import { Search, Sparkles, Key, Sun, Moon } from 'lucide-react';
import { ResearchResponse } from '../types';

interface HeaderProps {
    setResearchData: (data: ResearchResponse | null) => void;
    setTopic: (topic: string) => void;
    setShowKeyModal: (show: boolean) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
    setResearchData,
    setTopic,
    setShowKeyModal,
    isDarkMode,
    setIsDarkMode
}) => {
    return (
        <header className="border-b border-amber-400 dark:border-amber-500 sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-black/90 transition-colors shadow-sm shadow-zinc-300 dark:shadow-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => { setResearchData(null); setTopic(''); }}>
                    <div className="relative scale-90 md:scale-100">
                        <div className="bg-white dark:bg-black p-2.5 rounded-xl border border-amber-400 dark:border-amber-500 relative z-10 shadow-lg shadow-zinc-300 dark:shadow-zinc-800 group-hover:border-amber-300 transition-colors">
                            {/* Combined Search + Sparkle Icon */}
                            <div className="relative">
                                <Search className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute -top-1.5 -right-1.5 fill-amber-500 animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-lg md:text-2xl tracking-tight text-black dark:text-white leading-none">
                            Full Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">AI</span>
                        </span>
                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400 font-medium">Encontre resultados completos</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowKeyModal(true)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-colors border border-amber-400 dark:border-amber-500"
                    >
                        <Key className="w-3.5 h-3.5" />
                        <span>Chave API</span>
                    </button>

                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border border-amber-400 dark:border-amber-500 shadow-sm shadow-zinc-300 dark:shadow-zinc-800"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
