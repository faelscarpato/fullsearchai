
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, BrainCircuit, Brain, Network, Database, Globe, Zap, Search, FileText } from 'lucide-react';

interface LoadingProps {
  status: string;
  step: number;
  facts?: string[];
}

const SourceParticle = ({ delay, source, side }: { delay: number, source: string, side: 'left' | 'right' | 'top' | 'bottom' }) => {
  // Determine start position based on side
  let startClass = '';
  switch (side) {
    case 'left': startClass = 'left-[-20%] top-1/2'; break;
    case 'right': startClass = 'right-[-20%] top-1/2'; break;
    case 'top': startClass = 'top-[-20%] left-1/2'; break;
    case 'bottom': startClass = 'bottom-[-20%] left-1/2'; break;
  }

  return (
    <div
      className={`absolute flex items-center gap-2 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap opacity-0 select-none pointer-events-none z-10 ${startClass}`}
      style={{
        animation: `absorb 2s cubic-bezier(0.4, 0, 0.2, 1) infinite ${delay}s`,
      }}
    >
      <FileText className="w-3 h-3 text-amber-500" />
      <span className="bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded shadow-sm border border-amber-500/20">{source}</span>
    </div>
  );
};

const Loading: React.FC<LoadingProps> = ({ status, step, facts = [] }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  // Sources that will "feed" into the brain
  const searchSources = useMemo(() => [
    "Google Search", "Google Scholar", "PubMed", "arXiv",
    "Reuters", "Wikipedia", "JSTOR", "Deep Web",
    "News API", "Science Direct", "Capes"
  ], []);

  useEffect(() => {
    if (facts.length > 0) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [facts]);

  // Effect to trigger the "finish" glow right before component might unmount
  useEffect(() => {
    if (step >= 3) {
      setIsFinishing(true);
    }
  }, [step]);



  return (
    <div className={`relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-8 min-h-[400px] overflow-hidden rounded-3xl bg-white/40 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-md transition-all duration-700 ${isFinishing ? 'scale-105 opacity-0 filter blur-xl' : 'scale-100 opacity-100'}`}>

      {/* Background Neural Network Grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}>
      </div>

      {/* THE HYBRID BRAIN CONTAINER */}
      <div className={`relative z-20 mb-12 mt-8 transition-all duration-1000 ${isFinishing ? 'animate-[finish-flash_0.5s_ease-out_forwards]' : ''}`}>

        {/* Orbiting Rings */}
        <div className="absolute inset-0 -m-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-full animate-[spin-slow_20s_linear_infinite]"></div>
        <div className="absolute inset-0 -m-6 border border-amber-500/20 rounded-full animate-[spin-reverse_15s_linear_infinite]"></div>

        {/* Brain Composition */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">

          {/* Layer 1: Human/Organic Brain (Warm Colors) */}
          <div className="absolute inset-0 text-amber-400/80 dark:text-amber-500/60 blur-[1px] animate-[pulse-neural_3s_ease-in-out_infinite]">
            <Brain className="w-full h-full" strokeWidth={1.5} />
          </div>

          {/* Layer 2: Digital/AI Brain (Cool Colors) - Overlay */}
          <div className="absolute inset-0 text-amber-600 dark:text-amber-400 mix-blend-overlay dark:mix-blend-screen animate-[pulse-neural_3s_ease-in-out_infinite_0.5s]">
            <BrainCircuit className="w-full h-full" strokeWidth={1.5} />
          </div>

          {/* Core Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-amber-500/20 rounded-full blur-2xl animate-pulse"></div>

          {/* Synapse Sparks */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-300 rounded-full animate-ping delay-700"></div>
        </div>

        {/* Absorb Animation Container (Particles Flying In) */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0 overflow-visible">
          {searchSources.map((source, i) => {
            const side = ['left', 'right', 'top', 'bottom'][i % 4] as 'left' | 'right' | 'top' | 'bottom';
            // Only show a subset to avoid chaos, or stagger them
            if (i > 7) return null;
            return <SourceParticle key={i} source={source} delay={i * 0.8} side={side} />;
          })}
        </div>
      </div>

      {/* Status & Facts */}
      <div className="relative z-30 w-full max-w-lg flex flex-col items-center text-center transition-all duration-500 px-6">

        {/* Loading Spinner & Text */}
        <div className="flex items-center gap-3 mb-6 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full border border-amber-500/20 backdrop-blur-sm">
          {!isFinishing ? (
            <div className="relative">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute inset-0 opacity-75"></div>
              <div className="w-3 h-3 bg-amber-600 rounded-full relative"></div>
            </div>
          ) : (
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
          )}
          <h3 className="text-amber-800 dark:text-amber-300 font-bold text-xs md:text-sm tracking-[0.15em] uppercase font-display">
            {isFinishing ? "SÍNTESE CONCLUÍDA" : status}
          </h3>
        </div>

        {/* Dynamic Fact */}
        <div className="h-20 flex items-center justify-center">
          {facts.length > 0 ? (
            <div key={currentFactIndex} className="animate-in slide-in-from-bottom-2 fade-in duration-500">
              <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 font-serif-display leading-relaxed italic max-w-md">
                "{facts[currentFactIndex]}"
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 italic text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Conectando aos índices globais...</span>
            </div>
          )}
        </div>

        {/* Neural Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 mt-6 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${Math.min(step * 25, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/50 w-full animate-[shimmer_1s_infinite]"></div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-widest">
          Processing Neural Pathway {step}/4
        </p>
      </div>

    </div>
  );
};

export default Loading;
