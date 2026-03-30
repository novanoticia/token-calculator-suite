/**
 * Constants for token calculation
 * Language-specific ratios, fixed overhead, margins of error
 */

export const FIXED_DATA = {
  preferences: {
    tokens: 468,
    certainty: 'exact' as const,
    description: 'User Preferences block'
  },
  userMemories: {
    tokens: 3000,
    certainty: 'exact' as const,
    description: 'User Memory block'
  },
  systemPrompt: {
    tokensMin: 8000,
    tokensMax: 12000,
    tokensAvg: 10000,
    certainty: 'estimated' as const,
    description: 'System prompt (not accessible)'
  },
  overhead: {
    tokensMin: 500,
    tokensMax: 1000,
    tokensAvg: 750,
    certainty: 'estimated' as const,
    description: 'Administrative overhead'
  }
};

export const TOKENIZATION_RATIOS = {
  es: {
    wordsToTokens: 1.3,
    charsToTokens: 0.33,  // ~3 chars per token for Spanish (BPE splits more on non-ASCII)
    language: 'Spanish',
    accuracy: '±10-15%'
  },
  en: {
    wordsToTokens: 1.0,
    charsToTokens: 0.25,  // ~4 chars per token for English
    language: 'English',
    accuracy: '±5-10%'
  }
};

// 200,000 tokens per conversation — publicly documented by Anthropic
export const CONTEXT_WINDOW = 200000;

export const FILE_TOKENS = {
  image: {
    small: 500,
    medium: 1000,
    large: 1500,
    description: 'JPG/PNG images (size-dependent)'
  },
  pdf: {
    perPage: 300,
    overhead: 500,
    description: 'PDF (tokens per page + overhead)'
  },
  docx: {
    small: 5000,
    medium: 7500,
    large: 10000,
    description: 'Word documents'
  },
  code: {
    perLine: 5,
    description: 'Code files (approximately 5 tokens per line)'
  },
  webSearch: {
    perResult: 400,
    description: 'Web search results (per result snippet)'
  }
};

export const ERROR_MARGINS = {
  withExactData: 0.18,     // ±18% when using exact Preferences + Memory
  standardEstimate: 0.22,  // ±22% with some estimates
  highUncertainty: 0.30    // ±30% when many variables unknown
};
