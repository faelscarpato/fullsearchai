
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ComplexityLevel, ResponseFormat, ResearchResponse, Language, SearchFocus } from "../types";

// Create a fresh client. Accepts optional key override.
const getAi = (apiKeyOverride?: string) => {
  const apiKey = apiKeyOverride || process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables or storage");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

// Models
// Simple Search: Gemini 2.0 Flash
const SIMPLE_MODEL = 'gemini-2.0-flash-exp';
// Deep Research: Gemini 2.0 Flash Thinking
const RESEARCH_MODEL = 'gemini-2.5-flash';

export const performResearch = async (
  topic: string,
  level: ComplexityLevel,
  format: ResponseFormat,
  language: Language,
  useDeepResearch: boolean,
  searchFocus: SearchFocus[],
  apiKey?: string // Add optional apiKey parameter
): Promise<ResearchResponse> => {

  // Build a composite instruction string based on selected focuses
  const focusMap: Record<string, string> = {
    'news': "Notícias recentes, jornalismo e eventos atuais",
    'academic': "Papers, artigos acadêmicos revisados por pares e publicações universitárias",
    'scientific': "Dados científicos rigorosos, estudos de laboratório e descobertas técnicas",
    'posts': "Discussões da comunidade, fóruns (Reddit, etc.), blogs e opinião pública",
    'book': "Livros, literatura, capítulos de livros e autores renomados",
    'general': "Visão ampla e geral"
  };

  const selectedInstructions = searchFocus.map(f => focusMap[f] || focusMap['general']).join("; ");

  const systemInstruction = `
[PAPEL / PERSONA DO MODELO]
Você é um **assistente de pesquisa acadêmica e curiosidade guiada**, com foco em **ensino e visualização do conhecimento**.
Você deve se comportar como um **professor-pesquisador** que organiza o caos da internet em conhecimento estruturado, adaptado ao nível do usuário.

[OBJETIVO PRINCIPAL]
Dado um tema de busca e algumas preferências do usuário, você deve:
1. **Pesquisar** o tema usando ferramentas de busca conectadas.
2. **Organizar os resultados em cards**, diferenciando: notícias, artigos acadêmicos, livros, conteúdos gerais.
3. Para cada card, gerar: resumo adaptado, pontos-chave e metadados.
4. Gerar um **resumo geral** e **perguntas de continuação**.

[CRITÉRIOS]
- Responda SEMPRE no idioma: ${language}.
- Nível de complexidade: ${level}.
- Formato de Resposta: ${format}.
- Focos da pesquisa (COMBINADOS): ${selectedInstructions}.
- Se 'book' estiver nos focos, certifique-se de encontrar livros relevantes e categorizá-los com type: 'book'.
- Se deepResearch for true, aprofunde na busca e síntese.
`;

  // We explicitly structure the prompt to ask for JSON because we cannot use responseMimeType: 'application/json' 
  // simultaneously with the googleSearch tool in the current API version without triggering a 400 error.
  const prompt = `
    Realize uma pesquisa completa sobre: "${topic}".
    
    Parâmetros:
    - Idioma: ${language}
    - Nível: ${level}
    - Formato: ${format}
    - Deep Research Ativado: ${useDeepResearch}
    - Tipos de Fonte Prioritários: ${searchFocus.join(', ')}
    
    Instrução Específica de Foco: Pesquise ativamente por fontes que se encaixem em: ${selectedInstructions}.

    IMPORTANTE: Retorne APENAS um JSON válido. Não inclua texto introdutório ou markdown (\`\`\`json).
    Certifique-se de que todo o conteúdo textual (títulos, resumos, explicações) esteja em ${language}.
    NÃO adicione pontos finais após fechar colchetes de arrays ou chaves de objetos (ex: "],." é inválido).
    
    Siga estritamente esta estrutura JSON:
    {
      "query": "${topic}",
      "language": "${language}",
      "complexityLevel": "${level}",
      "responseFormat": "${format}",
      "useDeepResearch": ${useDeepResearch},
      "globalSummary": "Resumo geral do tópico...",
      "insights": ["Fato interessante 1", "Fato interessante 2"],
      "cards": [
        {
          "id": "unique_id_1",
          "type": "news" | "academic" | "book" | "web" | "other",
          "title": "Título do recurso",
          "source": "Nome da fonte/Site",
          "authors": ["Autor 1", "Autor 2"],
          "publicationDate": "Data ou 'N/A'",
          "url": "URL se disponível",
          "snippet": "Resumo curto do conteúdo...",
          "keyPoints": ["Ponto chave 1", "Ponto chave 2"],
          "levelAdaptedExplanation": "Explicação adaptada ao nível ${level}...",
          "modalContent": {
            "detailedExplanation": "Explicação aprofundada...",
            "examples": ["Exemplo prático 1"],
            "relatedConcepts": ["Conceito relacionado A"],
            "caveatsOrLimitations": ["Limitação ou contexto importante"]
          },
          // imagePrompt removed
          "relevanceScore": 0.9
        }
      ],
      "followUpSuggestions": ["Pergunta sugerida 1?", "Pergunta sugerida 2?"],
      "safetyNotes": ["Nota sobre viés ou segurança se necessário"]
    }
  `;

  // Select model based on depth
  const modelName = useDeepResearch ? RESEARCH_MODEL : SIMPLE_MODEL;

  const response = await getAi(apiKey).models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }],
      // responseMimeType: "application/json", // REMOVED to avoid conflict with googleSearch tool
    },
  });

  let text = response.text;
  if (!text) throw new Error("Sem resposta da IA");

  // Clean up markdown code blocks if the model includes them
  text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

  // Robustly extract the JSON object if there is extra text around it
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  // FIX: Common Gemini hallucination where it adds a period after an array closing bracket in JSON
  // Pattern: ] followed by dot, optional whitespace, and then a quote (start of next key)
  // Example: ["item"]. "nextKey" -> ["item"], "nextKey"
  text = text.replace(/\]\.\s*"/g, '], "');

  try {
    return JSON.parse(text) as ResearchResponse;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Falha ao processar resultados da pesquisa. A resposta da IA não foi um JSON válido.");
  }
};

// Image functions removed
