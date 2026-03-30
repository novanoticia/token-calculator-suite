/**
 * Token calculation functions
 * Core algorithms shared across all platforms
 */

import {
  FIXED_DATA,
  TOKENIZATION_RATIOS,
  CONTEXT_WINDOW,
  FILE_TOKENS,
  ERROR_MARGINS
} from './constants.js';

export interface TokenCalculationResult {
  totalTokens: number;
  minEstimate: number;
  maxEstimate: number;
  errorMargin: number;
  errorMarginPercent: string;
  breakdown: {
    fixedData: number;
    conversationVisible: number;
    files: number;
    other: number;
  };
  contextUsage: {
    tokensUsed: number;
    tokensAvailable: number;
    percentageUsed: number;
  };
  confidence: 'high' | 'medium' | 'low';
}

export interface ConversationInput {
  messageCount: number;
  userWords: number;
  assistantWords: number;
  language?: 'es' | 'en';
  useExactData?: boolean;
}

export interface FileInput {
  type: 'image' | 'pdf' | 'docx' | 'code' | 'web_search';
  size?: 'small' | 'medium' | 'large';
  pages?: number;
  lines?: number;
  resultCount?: number;
}

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

export function calculateTokens(
  conversation: ConversationInput,
  files: FileInput[] = [],
  useExactData: boolean = true
): TokenCalculationResult {
  // 1. Calculate fixed overhead
  const fixedData = calculateFixedData(useExactData);

  // 2. Calculate conversation tokens
  const conversationTokens = calculateConversationTokens(conversation);

  // 3. Calculate file tokens
  const fileTokens = files.reduce((sum, file) => sum + calculateFileTokens(file), 0);

  // 4. Calculate total
  const subtotal = fixedData + conversationTokens + fileTokens;

  // 5. Determine error margin
  const errorMargin = useExactData ? ERROR_MARGINS.withExactData : ERROR_MARGINS.standardEstimate;
  const minEstimate = Math.round(subtotal * (1 - errorMargin));
  const maxEstimate = Math.round(subtotal * (1 + errorMargin));
  const avgEstimate = Math.round((minEstimate + maxEstimate) / 2);

  // 6. Context usage
  const contextUsage = {
    tokensUsed: avgEstimate,
    tokensAvailable: CONTEXT_WINDOW,
    percentageUsed: (avgEstimate / CONTEXT_WINDOW) * 100
  };

  // 7. Determine confidence
  const confidence = useExactData ? 'high' : 'medium' as const;

  return {
    totalTokens: avgEstimate,
    minEstimate,
    maxEstimate,
    errorMargin: errorMargin * 100,
    errorMarginPercent: `±${(errorMargin * 100).toFixed(0)}%`,
    breakdown: {
      fixedData,
      conversationVisible: conversationTokens,
      files: fileTokens,
      other: 0
    },
    contextUsage,
    confidence
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateFixedData(useExactData: boolean): number {
  if (!useExactData) {
    return 0; // Don't include if user declined
  }

  const pref = FIXED_DATA.preferences.tokens;
  const mem = FIXED_DATA.userMemories.tokens;
  const sysAvg = FIXED_DATA.systemPrompt.tokensAvg;
  const ohAvg = FIXED_DATA.overhead.tokensAvg;

  return pref + mem + sysAvg + ohAvg;
}

export function calculateConversationTokens(input: ConversationInput): number {
  const lang = input.language || 'es';
  const ratio = TOKENIZATION_RATIOS[lang].wordsToTokens;

  const totalWords = input.userWords + input.assistantWords;
  return Math.round(totalWords * ratio);
}

export function calculateFileTokens(file: FileInput): number {
  switch (file.type) {
    case 'image':
      return FILE_TOKENS.image[file.size || 'medium'];

    case 'pdf':
      const pages = file.pages || 50;
      return FILE_TOKENS.pdf.overhead + pages * FILE_TOKENS.pdf.perPage;

    case 'docx':
      return FILE_TOKENS.docx[file.size || 'medium'];

    case 'code':
      const lines = file.lines || 100;
      return Math.round(lines * FILE_TOKENS.code.perLine);

    case 'web_search':
      const results = file.resultCount || 5;
      return results * FILE_TOKENS.webSearch.perResult;

    default:
      return 0;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatTokenResult(result: TokenCalculationResult): string {
  return `
📊 ESTIMACIÓN: ${result.minEstimate.toLocaleString()} - ${result.maxEstimate.toLocaleString()} tokens
📉 Margen de error: ${result.errorMarginPercent}
🔍 Confianza: ${result.confidence === 'high' ? 'Alta ✅' : result.confidence === 'medium' ? 'Media 🟡' : 'Baja ❌'}

DESGLOSE:
  • Datos fijos: ${result.breakdown.fixedData.toLocaleString()} tokens
  • Conversación visible: ${result.breakdown.conversationVisible.toLocaleString()} tokens
  • Archivos: ${result.breakdown.files.toLocaleString()} tokens

CONTEXTO:
  • Usado: ${result.contextUsage.tokensUsed.toLocaleString()} / ${result.contextUsage.tokensAvailable.toLocaleString()}
  • Porcentaje: ${result.contextUsage.percentageUsed.toFixed(1)}%
`;
}

export function wordsToTokens(words: number, language: 'es' | 'en' = 'es'): number {
  return Math.round(words * TOKENIZATION_RATIOS[language].wordsToTokens);
}

export function charsToTokens(chars: number, language: 'es' | 'en' = 'es'): number {
  return Math.round(chars * TOKENIZATION_RATIOS[language].charsToTokens);
}
