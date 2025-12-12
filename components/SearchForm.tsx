import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Search, Filter, ChevronDown, Check, GraduationCap, FileText, Globe, BrainCircuit, Microscope } from 'lucide-react';
import { ComplexityLevel, ResponseFormat, Language, SearchFocus } from '../types';

interface SearchFormProps {
    topic: string;
    setTopic: (topic: string) => void;
    onSearch: (e: React.FormEvent) => void;
    isLoading: boolean;

    complexityLevel: ComplexityLevel;
    setComplexityLevel: (level: ComplexityLevel) => void;

    responseFormat: ResponseFormat;
    setResponseFormat: (format: ResponseFormat) => void;

    language: Language;
    setLanguage: (lang: Language) => void;

    searchFocus: SearchFocus[];
    setSearchFocus: React.Dispatch<React.SetStateAction<SearchFocus[]>>;

    useDeepResearch: boolean;
    setUseDeepResearch: (use: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
    topic, setTopic, onSearch, isLoading,
    complexityLevel, setComplexityLevel,
    responseFormat, setResponseFormat,
    language, setLanguage,
    searchFocus, setSearchFocus,
    useDeepResearch, setUseDeepResearch
}) => {
    // State to track which dropdown is currently open
    const [activeDropdown, setActiveDropdown] = useState<'focus' | 'level' | 'format' | 'language' | null>(null);

    // Refs for click outside detection
    const focusRef = useRef<HTMLDivElement>(null);
    const levelRef = useRef<HTMLDivElement>(null);
    const formatRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown === 'focus' && focusRef.current && !focusRef.current.contains(event.target as Node)) setActiveDropdown(null);
            if (activeDropdown === 'level' && levelRef.current && !levelRef.current.contains(event.target as Node)) setActiveDropdown(null);
            if (activeDropdown === 'format' && formatRef.current && !formatRef.current.contains(event.target as Node)) setActiveDropdown(null);
            if (activeDropdown === 'language' && languageRef.current && !languageRef.current.contains(event.target as Node)) setActiveDropdown(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    const toggleSearchFocus = (focus: SearchFocus) => {
        if (focus === 'general') {
            setSearchFocus(['general']);
            return;
        }
        setSearchFocus(prev => {
            if (prev.includes('general') && prev.length === 1) return [focus];
            if (prev.includes(focus)) {
                const newFocus = prev.filter(f => f !== focus);
                return newFocus.length === 0 ? ['general'] : newFocus;
            }
            return [...prev.filter(f => f !== 'general'), focus];
        });
    };

    const getFocusLabel = () => {
        if (searchFocus.includes('general')) return 'Geral';
        if (searchFocus.length === 1) {
            const map: Record<string, string> = {
                'news': 'Notícias', 'academic': 'Acadêmico', 'scientific': 'Científico', 'posts': 'Fórum', 'book': 'Livros'
            };
            return map[searchFocus[0]] || searchFocus[0];
        }
        return `${searchFocus.length} Selecionados`;
    };

    // Configuration for options
    const levelOptions: { value: ComplexityLevel, label: string }[] = [
        { value: 'Elementary', label: 'Fundamental' },
        { value: 'High School', label: 'Ensino Médio' },
        { value: 'College', label: 'Superior' },
        { value: 'Expert', label: 'Especialista' }
    ];

    const formatOptions: { value: ResponseFormat, label: string }[] = [
        { value: 'Detailed', label: 'Detalhado' },
        { value: 'Concise', label: 'Conciso' },
        { value: 'Bullet Points', label: 'Lista de Pontos' },
        { value: 'Table', label: 'Tabela Comparativa' },
        { value: 'Step-by-Step', label: 'Passo a Passo' }
    ];

    const languageOptions: { value: Language, label: string }[] = [
        { value: 'Portuguese', label: 'Português' },
        { value: 'English', label: 'Inglês' },
        { value: 'Spanish', label: 'Espanhol' },
        { value: 'French', label: 'Francês' },
        { value: 'German', label: 'Alemão' },
        { value: 'Mandarin', label: 'Mandarim' },
        { value: 'Japanese', label: 'Japonês' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Arabic', label: 'Árabe' },
        { value: 'Russian', label: 'Russo' }
    ];

    // Helper to get labels
    const getLevelLabel = () => levelOptions.find(o => o.value === complexityLevel)?.label || complexityLevel;
    const getFormatLabel = () => formatOptions.find(o => o.value === responseFormat)?.label || responseFormat;
    const getLanguageLabel = () => languageOptions.find(o => o.value === language)?.label || language;

    return (
        <form onSubmit={onSearch} className={`relative z-20 transition-all duration-300 ${isLoading ? 'opacity-50 pointer-events-none scale-95 blur-sm' : 'scale-100'}`}>
            <div className="relative group">
                <div className="absolute -inset-1 bg-zinc-700 rounded-3xl opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition duration-500 blur-xl"></div>

                <div className="relative bg-white dark:bg-black backdrop-blur-xl border border-amber-400 dark:border-amber-500 p-2 rounded-3xl shadow-xl shadow-zinc-400/50 dark:shadow-zinc-800/50">

                    {/* Main Input */}
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 md:left-6 w-5 h-5 md:w-6 md:h-6 text-zinc-500 dark:text-zinc-400 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors" />
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Sobre o que você quer aprender?"
                            className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-6 bg-transparent border-none outline-none text-base md:text-2xl placeholder:text-zinc-400 font-medium text-black dark:text-white"
                        />
                    </div>

                    {/* Controls Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 mt-2">

                        {/* Focus Selector */}
                        <div ref={focusRef} className="relative group/item z-30">
                            <button
                                type="button"
                                className={`w-full bg-white dark:bg-black rounded-2xl border px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer text-left shadow-sm shadow-zinc-300 dark:shadow-zinc-800 group/input ${activeDropdown === 'focus' ? 'border-amber-500' : 'border-amber-400 dark:border-amber-500 hover:border-amber-500'}`}
                                onClick={() => setActiveDropdown(activeDropdown === 'focus' ? null : 'focus')}
                            >
                                <div className="p-2 bg-white dark:bg-black rounded-lg text-amber-600 dark:text-amber-400 shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                    <Filter className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer group-hover/input:text-amber-500 transition-colors">Foco</label>
                                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-black dark:text-white">
                                        <span className="truncate">{getFocusLabel()}</span>
                                        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeDropdown === 'focus' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* Focus Dropdown Menu */}
                            {activeDropdown === 'focus' && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-black rounded-xl border border-amber-400 dark:border-amber-500 shadow-xl shadow-zinc-400 dark:shadow-zinc-900 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                                    <div className="p-1 max-h-60 overflow-y-auto">
                                        {[
                                            { id: 'general', label: 'Geral' },
                                            { id: 'news', label: 'Notícias' },
                                            { id: 'academic', label: 'Acadêmico' },
                                            { id: 'scientific', label: 'Científico' },
                                            { id: 'book', label: 'Livros' },
                                            { id: 'posts', label: 'Postagens/Fórum' },
                                        ].map((option) => (
                                            <div
                                                key={option.id}
                                                onClick={() => toggleSearchFocus(option.id as SearchFocus)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-sm font-medium transition-colors group/option"
                                            >
                                                <span className="text-zinc-800 dark:text-zinc-200 group-hover/option:text-amber-600 dark:group-hover/option:text-amber-400 transition-colors">{option.label}</span>
                                                {searchFocus.includes(option.id as SearchFocus) && (
                                                    <Check className="w-4 h-4 text-amber-500" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Level Selector */}
                        <div ref={levelRef} className="relative group/item z-20">
                            <button
                                type="button"
                                className={`w-full bg-white dark:bg-black rounded-2xl border px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer text-left shadow-sm shadow-zinc-300 dark:shadow-zinc-800 group/input ${activeDropdown === 'level' ? 'border-amber-500' : 'border-amber-400 dark:border-amber-500 hover:border-amber-500'}`}
                                onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
                            >
                                <div className="p-2 bg-white dark:bg-black rounded-lg text-amber-600 dark:text-amber-400 shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer group-hover/input:text-amber-500 transition-colors">Nível</label>
                                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-black dark:text-white">
                                        <span className="truncate">{getLevelLabel()}</span>
                                        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeDropdown === 'level' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {activeDropdown === 'level' && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-black rounded-xl border border-amber-400 dark:border-amber-500 shadow-xl shadow-zinc-400 dark:shadow-zinc-900 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                                    <div className="p-1 max-h-60 overflow-y-auto">
                                        {levelOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => { setComplexityLevel(option.value); setActiveDropdown(null); }}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-sm font-medium transition-colors group/option"
                                            >
                                                <span className="text-zinc-800 dark:text-zinc-200 group-hover/option:text-amber-600 dark:group-hover/option:text-amber-400 transition-colors">{option.label}</span>
                                                {complexityLevel === option.value && <Check className="w-4 h-4 text-amber-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Format Selector */}
                        <div ref={formatRef} className="relative group/item z-10">
                            <button
                                type="button"
                                className={`w-full bg-white dark:bg-black rounded-2xl border px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer text-left shadow-sm shadow-zinc-300 dark:shadow-zinc-800 group/input ${activeDropdown === 'format' ? 'border-amber-500' : 'border-amber-400 dark:border-amber-500 hover:border-amber-500'}`}
                                onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
                            >
                                <div className="p-2 bg-white dark:bg-black rounded-lg text-amber-600 dark:text-amber-400 shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer group-hover/input:text-amber-500 transition-colors">Formato</label>
                                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-black dark:text-white">
                                        <span className="truncate">{getFormatLabel()}</span>
                                        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeDropdown === 'format' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* Format Dropdown Menu */}
                            {activeDropdown === 'format' && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-black rounded-xl border border-amber-400 dark:border-amber-500 shadow-xl shadow-zinc-400 dark:shadow-zinc-900 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                                    <div className="p-1 max-h-60 overflow-y-auto">
                                        {formatOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => {
                                                    setResponseFormat(option.value);
                                                    setActiveDropdown(null);
                                                }}
                                                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors rounded-lg mb-1 last:mb-0 ${responseFormat === option.value ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                                            >
                                                {responseFormat === option.value && <Check className="w-3.5 h-3.5 text-amber-500" />}
                                                <span className={responseFormat === option.value ? 'ml-0' : 'ml-5.5'}>{option.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <div ref={languageRef} className="relative group/item z-0">
                            <button
                                type="button"
                                className={`w-full bg-white dark:bg-black rounded-2xl border px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer text-left shadow-sm shadow-zinc-300 dark:shadow-zinc-800 group/input ${activeDropdown === 'language' ? 'border-amber-500' : 'border-amber-400 dark:border-amber-500 hover:border-amber-500'}`}
                                onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                            >
                                <div className="p-2 bg-white dark:bg-black rounded-lg text-amber-600 dark:text-amber-400 shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer group-hover/input:text-amber-500 transition-colors">Idioma</label>
                                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-black dark:text-white">
                                        <span className="truncate">{getLanguageLabel()}</span>
                                        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {activeDropdown === 'language' && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-black rounded-xl border border-amber-400 dark:border-amber-500 shadow-xl shadow-zinc-400 dark:shadow-zinc-900 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                                    <div className="p-1 max-h-60 overflow-y-auto">
                                        {languageOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => { setLanguage(option.value); setActiveDropdown(null); }}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-sm font-medium transition-colors group/option"
                                            >
                                                <span className="text-zinc-800 dark:text-zinc-200 group-hover/option:text-amber-600 dark:group-hover/option:text-amber-400 transition-colors">{option.label}</span>
                                                {language === option.value && <Check className="w-4 h-4 text-amber-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex flex-col md:flex-row gap-2 px-2 pb-2">
                        {/* Deep Research Toggle */}
                        <button
                            type="button"
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all flex-1 text-left shadow-sm shadow-zinc-300 dark:shadow-zinc-800 ${useDeepResearch ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-600' : 'bg-zinc-50 dark:bg-zinc-900 border-amber-400 dark:border-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                            onClick={() => setUseDeepResearch(!useDeepResearch)}
                        >
                            <div className={`p-1.5 rounded-lg transition-colors ${useDeepResearch ? 'bg-amber-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                                <BrainCircuit className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-xs font-bold uppercase tracking-wider ${useDeepResearch ? 'text-amber-700 dark:text-amber-300' : 'text-zinc-500 dark:text-zinc-400'}`}>Deep Research</span>
                                <span className="text-[10px] text-zinc-400 leading-tight">Busca Profunda 2.0</span>
                            </div>
                        </button>

                        {/* Generate Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 md:py-4 rounded-2xl font-bold font-display tracking-wide transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Microscope className="w-5 h-5" />
                            <span>PESQUISAR</span>
                        </button>
                    </div>

                </div>
            </div>
        </form>
    );
};

export default SearchForm;
