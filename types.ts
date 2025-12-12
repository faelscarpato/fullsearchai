
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AspectRatio = '16:9' | '9:16' | '1:1';

export type ComplexityLevel = 'Elementary' | 'High School' | 'College' | 'Expert';

export type ResponseFormat = 'Detailed' | 'Concise' | 'Bullet Points' | 'Table' | 'Step-by-Step';

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Mandarin' | 'Japanese' | 'Hindi' | 'Arabic' | 'Portuguese' | 'Russian';

// New type for search focus - Added 'book'
export type SearchFocus = 'general' | 'news' | 'academic' | 'posts' | 'scientific' | 'book';

// Image types removed

export interface SearchResultItem {
  title: string;
  url: string;
}

export interface ModalContent {
  detailedExplanation: string;
  examples: string[];
  relatedConcepts: string[];
  caveatsOrLimitations: string[];
}

export interface ResearchCard {
  id: string;
  type: 'news' | 'academic' | 'book' | 'web' | 'other';
  title: string;
  source: string;
  authors?: string[];
  publicationDate?: string;
  url?: string;
  snippet: string;
  keyPoints: string[];
  levelAdaptedExplanation: string;
  modalContent: ModalContent;
  // imagePrompt removed
  relevanceScore: number;
}

export interface ResearchResponse {
  query: string;
  language: Language;
  complexityLevel: ComplexityLevel;
  responseFormat: ResponseFormat;
  useDeepResearch: boolean;
  globalSummary: string;
  insights: string[];
  cards: ResearchCard[];
  followUpSuggestions: string[];
  safetyNotes: string[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}