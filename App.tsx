import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import ResearchResultView from './components/ResearchResultView';
import IntroScreen from './components/IntroScreen';
import Header from './components/Header';
import { performResearch } from './services/geminiService';
import { ResearchResponse, ResearchCard, ComplexityLevel, ResponseFormat, Language, SearchFocus } from './types';
import Loading from './components/Loading';
import { BGPattern } from './components/ui/bg-pattern';
import { Compass, AlertCircle, Key, CreditCard, ChevronRight, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import CardModal from './components/CardModal';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [topic, setTopic] = useState('');
  const [researchData, setResearchData] = useState<ResearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ResearchCard | null>(null);
  // mainVisual state removed

  // Form State
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>('College');
  const [responseFormat, setResponseFormat] = useState<ResponseFormat>('Detailed');
  const [language, setLanguage] = useState<Language>('Portuguese');
  const [searchFocus, setSearchFocus] = useState<SearchFocus[]>(['general']);
  const [useDeepResearch, setUseDeepResearch] = useState(false);

  // API Key State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);


  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Load saved key
    const savedKey = localStorage.getItem('GEMINI_CUSTOM_KEY');
    if (savedKey) {
      setCustomApiKey(savedKey);
      setUseDeepResearch(true); // Auto-enable deep features if key is present
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const validateKey = (key: string) => {
    // Simple regex validation for Gemini keys (usually AIza...)
    return key.startsWith('AIza') && key.length > 30;
  };

  const handleSaveKey = () => {
    if (!customApiKey.trim()) return;

    // Basic validation signal
    if (validateKey(customApiKey)) {
      setIsKeyValid(true);
      localStorage.setItem('GEMINI_CUSTOM_KEY', customApiKey);
      setTimeout(() => setShowKeyModal(false), 800); // Close after success animation
    } else {
      setIsKeyValid(false); // Invalid signal
    }
  };

  const clearKey = () => {
    localStorage.removeItem('GEMINI_CUSTOM_KEY');
    setCustomApiKey('');
    setIsKeyValid(null);
  };

  const handleGenerate = async (e: React.FormEvent, overrideTopic?: string) => {
    if (e) e.preventDefault();
    const query = overrideTopic || topic;

    if (isLoading) return;

    if (!query.trim()) {
      setError("Por favor, digite um tópico para pesquisar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);
    setLoadingFacts([]);
    setResearchData(null);
    setShowKeyModal(false);

    setLoadingMessage(`Iniciando ${useDeepResearch ? 'Deep ' : ''}Research Protocol...`);

    try {
      // Step 1: Research
      // Pass the custom key explicitly
      const result = await performResearch(
        query,
        complexityLevel,
        responseFormat,
        language,
        useDeepResearch,
        searchFocus,
        customApiKey || undefined // Pass undefined if empty to let service handle fallbacks
      );

      setResearchData(result);
      setLoadingFacts(result.insights.slice(0, 5));

      setLoadingStep(2);
      setLoadingMessage(`Sintetizando Dados...`);

    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("403") || err.message.includes("key"))) {
        setShowKeyModal(true);
        setError("Chave de API inválida ou ausente. Por favor configure sua chave.");
      } else {
        setError('O serviço de pesquisa está indisponível. Verifique sua chave API ou tente novamente.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
      setTopic(query);
    }
  };

  // handleGenerateMainVisual removed

  const handleFollowUp = (query: string) => {
    handleGenerate(null as any, query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Improved API Key Input Modal
  const KeyInputModal = () => (
    <div className="fixed inset-0 z-[200] bg-zinc-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-black/80 border-2 border-amber-500 rounded-3xl shadow-[0_0_50px_-5px_rgba(245,158,11,0.3)] max-w-lg w-full p-8 relative overflow-hidden group">

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        <button
          onClick={() => setShowKeyModal(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <div className="sr-only">Fechar</div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2 shadow-lg shadow-amber-900/40">
              <Key className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Configurar Chave Gemini</h2>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              Para usar o <strong className="text-amber-400">Deep Research 2.0</strong>, você precisa de uma chave API do Google.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => {
                  setCustomApiKey(e.target.value);
                  setIsKeyValid(null); // Reset validation on type
                }}
                placeholder="Cole sua chave API aqui (AIza...)"
                className={`w-full bg-zinc-900/50 border-2 ${isKeyValid === true ? 'border-green-500 text-green-500' : isKeyValid === false ? 'border-red-500' : 'border-zinc-700 focus:border-amber-500'} rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-all font-mono text-sm`}
              />

              {/* Status Indicator inside Input */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isKeyValid === true && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
                {isKeyValid === false && <AlertCircle className="w-5 h-5 text-red-500 animate-in zoom-in" />}
              </div>
            </div>

            <button
              onClick={handleSaveKey}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isKeyValid === true ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-white hover:bg-zinc-200 text-black'}`}
            >
              {isKeyValid === true ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Chave Conectada com Sucesso!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Salvar e Conectar</span>
                </>
              )}
            </button>

            <div className="pt-4 border-t border-zinc-800 flex flex-col items-center gap-3">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider font-bold"
              >
                <span>Obter chave no Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              {customApiKey && (
                <button onClick={clearKey} className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors">
                  Sair / Remover Chave
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showKeyModal && <KeyInputModal />}

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          triggerKeySelection={() => setShowKeyModal(true)}
        />
      )}

      {showIntro ? (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      ) : (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-amber-500 selection:text-white pb-20 relative overflow-x-hidden animate-in fade-in duration-1000 transition-colors">

          <BGPattern variant="grid" size={40} mask="fade-edges" fill="#1a1a1a" className="opacity-40 fixed inset-0 z-0 pointer-events-none" />

          <Header
            setResearchData={setResearchData}
            setTopic={setTopic}
            setShowKeyModal={setShowKeyModal} // Opens the input modal
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          <main className="px-3 sm:px-6 py-4 md:py-8 relative z-10">

            <div className={`max-w-6xl mx-auto transition-all duration-500 ${researchData ? 'mb-8' : 'min-h-[50vh] md:min-h-[70vh] flex flex-col justify-center'}`}>

              {!researchData && (
                <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-black border border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-md shadow-zinc-400 dark:shadow-zinc-800 backdrop-blur-sm">
                    <Compass className="w-3 h-3 md:w-4 md:h-4" /> Pesquisa sem limite de dados
                  </div>
                  <h1 className="text-3xl sm:text-5xl md:text-8xl font-display font-bold text-zinc-900 dark:text-white tracking-tight leading-[0.95] md:leading-[0.9]">
                    Explore <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400">A Profundidade.</span>
                  </h1>
                  <p className="text-sm md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed px-4">
                    Pesquise tópicos complexos com cards de conhecimento estruturados, potencializados pelo Google Search.
                  </p>
                </div>
              )}

              <SearchForm
                topic={topic}
                setTopic={setTopic}
                onSearch={handleGenerate}
                isLoading={isLoading}
                complexityLevel={complexityLevel}
                setComplexityLevel={setComplexityLevel}
                responseFormat={responseFormat}
                setResponseFormat={setResponseFormat}
                language={language}
                setLanguage={setLanguage}
                searchFocus={searchFocus}
                setSearchFocus={setSearchFocus}
                useDeepResearch={useDeepResearch}
                setUseDeepResearch={(val) => {
                  // Logic: If user tries to enable deep research but has no key, prompt them
                  // But if key is already there (from localstorage/env), just toggle.
                  // if (val && !customApiKey && !import.meta.env.VITE_GOOGLE_API_KEY) {
                  // setShowKeyModal(true);
                  // } else {
                  setUseDeepResearch(val);
                  // }
                }}
              />
            </div>

            {isLoading && <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} />}

            {error && (
              <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center gap-4 text-red-800 dark:text-red-200 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 shadow-sm">
                <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400" />
                <div className="flex-1">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {researchData && !isLoading && (
              <ResearchResultView
                data={researchData}
                onCardClick={setSelectedCard}
                onFollowUp={handleFollowUp}
              />
            )}

          </main>
        </div>
      )}
    </>
  );
};

export default App;
