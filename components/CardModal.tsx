/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResearchCard } from '../types';
import { X, ExternalLink, CheckCircle, AlertCircle, Printer } from 'lucide-react';

interface CardModalProps {
  card: ResearchCard;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const printCard = () => {
    const popup = window.open('', '_blank', 'width=900,height=1000');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Imprimir Card - ${card.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { margin: 0 0 12px; font-size: 26px; }
            h2 { margin: 12px 0 8px; font-size: 22px; }
            h3 { margin: 10px 0 6px; font-size: 16px; }
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
            <h3>Pontos chave</h3>
            <ul>${card.keyPoints.map((p) => `<li>${p}</li>`).join('')}</ul>
          </div>

          <div class="section">
            <h3>Em profundidade</h3>
            <p>${card.modalContent.detailedExplanation}</p>
          </div>

          ${card.modalContent.examples.length ? `
            <div class="section">
              <h3>Exemplos</h3>
              <ul>${card.modalContent.examples.map((p) => `<li>${p}</li>`).join('')}</ul>
            </div>
          ` : ''}

          ${card.modalContent.caveatsOrLimitations.length ? `
            <div class="section">
              <h3>Limitações & contexto</h3>
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                {card.type}
              </span>
              <span className="text-xs text-zinc-500">{card.source} - {card.publicationDate || 'Recente'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 dark:text-white leading-tight">
              {card.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">

          {/* Main Explanation */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {card.levelAdaptedExplanation}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Key Points */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Pontos Chave
              </h3>
              <ul className="space-y-3">
                {card.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Em Profundidade</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.modalContent.detailedExplanation}
                </p>
              </div>

              {card.modalContent.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Exemplos</h3>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {card.modalContent.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Caveats */}
          {card.modalContent.caveatsOrLimitations.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block mb-1">Limitacoes & Contexto</span>
                <ul className="list-disc list-inside opacity-90">
                  {card.modalContent.caveatsOrLimitations.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <button
            type="button"
            onClick={printCard}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-bold hover:underline"
            >
              Ver Fonte <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
};

export default CardModal;
