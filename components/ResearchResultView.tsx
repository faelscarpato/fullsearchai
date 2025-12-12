/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResearchResponse, ResearchCard } from '../types';
import { Sparkles, ArrowRight, BookOpen, Globe, Newspaper, GraduationCap, AlertTriangle, Lightbulb, Printer } from 'lucide-react';

interface ResearchResultViewProps {
  data: ResearchResponse;
  onCardClick: (card: ResearchCard) => void;
  onFollowUp: (query: string) => void;
}

const ResearchResultView: React.FC<ResearchResultViewProps> = ({ data, onCardClick, onFollowUp }) => {

  const printCard = (card: ResearchCard) => {
    const popup = window.open('', '_blank', 'width=900,height=1000');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Imprimir Card - ${card.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { margin: 0 0 12px; font-size: 24px; }
            h2 { margin: 16px 0 8px; font-size: 18px; }
            ul { padding-left: 20px; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 8px; background: #fbbf24; color: #111; font-weight: bold; font-size: 12px; }
            .meta { color: #555; font-size: 12px; margin-left: 8px; }
            .section { margin-top: 16px; }
            .divider { margin: 24px 0; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div>
            <span class="badge">${card.type}</span>
            <span class="meta">${card.source}${card.publicationDate ? ` - ${card.publicationDate}` : ''}</span>
          </div>
          <h1>${card.title}</h1>
          <p>${card.levelAdaptedExplanation}</p>

          <div class="section">
            <h2>Pontos chave</h2>
            <ul>${card.keyPoints.map((p) => `<li>${p}</li>`).join('')}</ul>
          </div>

          <div class="section">
            <h2>Em profundidade</h2>
            <p>${card.modalContent.detailedExplanation}</p>
          </div>

          ${card.modalContent.examples.length ? `
            <div class="section">
              <h2>Exemplos</h2>
              <ul>${card.modalContent.examples.map((p) => `<li>${p}</li>`).join('')}</ul>
            </div>
          ` : ''}

          ${card.modalContent.caveatsOrLimitations.length ? `
            <div class="section">
              <h2>Limitações & contexto</h2>
              <ul>${card.modalContent.caveatsOrLimitations.map((p) => `<li>${p}</li>`).join('')}</ul>
            </div>
          ` : ''}

          ${card.url ? `<div class="divider"></div><p>Fonte: ${card.url}</p>` : ''}
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
    popup.close();
  };

  const printAll = () => {
    window.print();
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'academic': return <GraduationCap className="w-4 h-4" />;
      case 'news': return <Newspaper className="w-4 h-4" />;
      case 'book': return <BookOpen className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-zinc-100 dark:bg-zinc-900/50 text-amber-700 dark:text-amber-400 border-zinc-200 dark:border-zinc-800';
      case 'news': return 'bg-zinc-100 dark:bg-zinc-900/50 text-amber-700 dark:text-amber-400 border-zinc-200 dark:border-zinc-800';
      case 'book': return 'bg-zinc-100 dark:bg-zinc-900/50 text-amber-700 dark:text-amber-400 border-zinc-200 dark:border-zinc-800';
      default: return 'bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 border-amber-400 dark:border-amber-500';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">

      {/* Safety Notes */}
      {data.safetyNotes && data.safetyNotes.length > 0 && (
        <div className="bg-white dark:bg-black border border-amber-500 rounded-xl p-4 flex items-start gap-3 shadow-md shadow-zinc-300 dark:shadow-zinc-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">Notas de Atenção</h4>
            <ul className="text-sm text-amber-700 dark:text-amber-400/80 list-disc list-inside">
              {data.safetyNotes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-black border border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>Resumo da Pesquisa</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-black dark:text-white leading-tight">
          {data.query}
        </h2>
        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-4 border-amber-500 pl-6">
          {data.globalSummary}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={printAll}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir resultado completo
          </button>
        </div>

        {/* Insights */}
        <div className="space-y-3 pt-4">
          {data.insights.slice(0, 3).map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-black border border-amber-400 dark:border-amber-500/50 shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div>
        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          Cards de Conhecimento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.cards.map((card) => (
            <button
              key={card.id}
              onClick={() => onCardClick(card)}
              className="flex flex-col text-left h-full bg-white dark:bg-black border border-amber-400 dark:border-amber-500 rounded-2xl p-6 transition-all duration-300 group
              hover:shadow-xl hover:shadow-zinc-300 dark:hover:shadow-zinc-800 hover:scale-[1.01] hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:-translate-y-2 hover:border-amber-500 dark:hover:border-amber-400"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getCardColor(card.type)}`}>
                  {getCardIcon(card.type)}
                  {card.type}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); printCard(card); }}
                    className="p-1 rounded-md border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    aria-label="Imprimir card"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {card.source}
                  </span>
                </div>
              </div>

              <h4 className="text-lg font-bold text-black dark:text-white mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {card.title}
              </h4>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                {card.snippet}
              </p>

              <div className="mt-auto pt-4 border-t border-amber-200 dark:border-amber-900 w-full">
                <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                  <span>Explorar Conceito</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Follow Up */}
      <div className="bg-white dark:bg-black rounded-2xl p-6 md:p-8 border border-amber-400 dark:border-amber-500 text-center shadow-lg shadow-zinc-300 dark:shadow-zinc-800">
        <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-6">Continue sua jornada</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {data.followUpSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onFollowUp(suggestion)}
              className="px-4 py-2 rounded-full bg-white dark:bg-black border border-amber-400 dark:border-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-sm font-medium transition-all shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ResearchResultView;
