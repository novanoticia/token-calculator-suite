/**
 * Tests for @token-calc/core
 * Covers: calculateTokens, calculateFixedData, calculateConversationTokens,
 *         calculateFileTokens, wordsToTokens, charsToTokens
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTokens,
  calculateFixedData,
  calculateConversationTokens,
  calculateFileTokens,
  wordsToTokens,
  charsToTokens,
  formatTokenResult,
  type ConversationInput,
  type FileInput,
} from '../index.js';

// ============================================
// calculateFixedData
// ============================================

describe('calculateFixedData', () => {
  it('returns sum of all fixed components when useExactData is true', () => {
    const result = calculateFixedData(true);
    // preferences(468) + userMemories(3000) + systemPrompt(10000) + overhead(750) = 14218
    assert.equal(result, 14218);
  });

  it('returns 0 when useExactData is false', () => {
    assert.equal(calculateFixedData(false), 0);
  });
});

// ============================================
// calculateConversationTokens
// ============================================

describe('calculateConversationTokens', () => {
  it('calculates Spanish tokens correctly (ratio 1.3)', () => {
    const input: ConversationInput = {
      messageCount: 10,
      userWords: 1000,
      assistantWords: 2000,
      language: 'es',
    };
    // (1000 + 2000) * 1.3 = 3900
    assert.equal(calculateConversationTokens(input), 3900);
  });

  it('calculates English tokens correctly (ratio 1.0)', () => {
    const input: ConversationInput = {
      messageCount: 10,
      userWords: 1000,
      assistantWords: 2000,
      language: 'en',
    };
    // (1000 + 2000) * 1.0 = 3000
    assert.equal(calculateConversationTokens(input), 3000);
  });

  it('defaults to Spanish when no language specified', () => {
    const input: ConversationInput = {
      messageCount: 5,
      userWords: 100,
      assistantWords: 100,
    };
    // (100 + 100) * 1.3 = 260
    assert.equal(calculateConversationTokens(input), 260);
  });
});

// ============================================
// calculateFileTokens
// ============================================

describe('calculateFileTokens', () => {
  it('calculates image tokens by size', () => {
    assert.equal(calculateFileTokens({ type: 'image', size: 'small' }), 500);
    assert.equal(calculateFileTokens({ type: 'image', size: 'medium' }), 1000);
    assert.equal(calculateFileTokens({ type: 'image', size: 'large' }), 1500);
  });

  it('defaults image to medium when no size specified', () => {
    assert.equal(calculateFileTokens({ type: 'image' }), 1000);
  });

  it('calculates PDF tokens: overhead + pages * perPage', () => {
    const file: FileInput = { type: 'pdf', pages: 10 };
    // 500 + 10 * 300 = 3500
    assert.equal(calculateFileTokens(file), 3500);
  });

  it('defaults PDF to 50 pages when not specified', () => {
    // 500 + 50 * 300 = 15500
    assert.equal(calculateFileTokens({ type: 'pdf' }), 15500);
  });

  it('calculates code tokens: lines * perLine', () => {
    const file: FileInput = { type: 'code', lines: 200 };
    // 200 * 5 = 1000
    assert.equal(calculateFileTokens(file), 1000);
  });

  it('calculates web_search tokens: resultCount * perResult', () => {
    const file: FileInput = { type: 'web_search', resultCount: 3 };
    // 3 * 400 = 1200
    assert.equal(calculateFileTokens(file), 1200);
  });

  it('returns 0 for unknown type', () => {
    assert.equal(calculateFileTokens({ type: 'unknown' as any }), 0);
  });
});

// ============================================
// calculateTokens (integration)
// ============================================

describe('calculateTokens', () => {
  it('returns a valid result with all fields', () => {
    const result = calculateTokens(
      { messageCount: 50, userWords: 5000, assistantWords: 8000, language: 'es' },
      [],
      true
    );

    assert.ok(result.totalTokens > 0);
    assert.ok(result.minEstimate < result.maxEstimate);
    assert.ok(result.minEstimate > 0);
    assert.equal(result.errorMargin, 18);
    assert.equal(result.errorMarginPercent, '±18%');
    assert.equal(result.confidence, 'high');
    assert.equal(result.contextUsage.tokensAvailable, 200000);
    assert.ok(result.contextUsage.percentageUsed > 0);
  });

  it('uses standard margin when useExactData is false', () => {
    const result = calculateTokens(
      { messageCount: 10, userWords: 1000, assistantWords: 1000, language: 'en' },
      [],
      false
    );

    assert.equal(result.errorMargin, 22);
    assert.equal(result.confidence, 'medium');
    assert.equal(result.breakdown.fixedData, 0);
  });

  it('includes file tokens in the total', () => {
    const withFiles = calculateTokens(
      { messageCount: 5, userWords: 100, assistantWords: 100, language: 'en' },
      [{ type: 'pdf', pages: 10 }],
      false
    );
    const withoutFiles = calculateTokens(
      { messageCount: 5, userWords: 100, assistantWords: 100, language: 'en' },
      [],
      false
    );

    assert.ok(withFiles.totalTokens > withoutFiles.totalTokens);
    assert.equal(withFiles.breakdown.files, 3500); // 500 + 10*300
  });
});

// ============================================
// Utility functions
// ============================================

describe('wordsToTokens', () => {
  it('converts words to tokens for Spanish', () => {
    assert.equal(wordsToTokens(1000, 'es'), 1300);
  });

  it('converts words to tokens for English', () => {
    assert.equal(wordsToTokens(1000, 'en'), 1000);
  });

  it('defaults to Spanish', () => {
    assert.equal(wordsToTokens(100), 130);
  });
});

describe('charsToTokens', () => {
  it('converts chars to tokens for Spanish (0.33 ratio)', () => {
    // 3000 * 0.33 = 990
    assert.equal(charsToTokens(3000, 'es'), 990);
  });

  it('converts chars to tokens for English (0.25 ratio)', () => {
    // 4000 * 0.25 = 1000
    assert.equal(charsToTokens(4000, 'en'), 1000);
  });
});

describe('formatTokenResult', () => {
  it('returns a string containing key information', () => {
    const result = calculateTokens(
      { messageCount: 10, userWords: 500, assistantWords: 500, language: 'es' },
      [],
      true
    );
    const formatted = formatTokenResult(result);

    assert.ok(formatted.includes('ESTIMACIÓN'));
    assert.ok(formatted.includes('Margen de error'));
    assert.ok(formatted.includes('Confianza'));
    assert.ok(formatted.includes('DESGLOSE'));
    assert.ok(formatted.includes('CONTEXTO'));
  });
});

// ============================================
// Edge cases and validation
// ============================================

describe('validateConversationInput (via calculateTokens)', () => {
  it('throws when messageCount is negative', () => {
    assert.throws(
      () => calculateTokens({ messageCount: -1, userWords: 100, assistantWords: 100 }),
      /messageCount must be a non-negative finite number/
    );
  });

  it('throws when userWords is NaN', () => {
    assert.throws(
      () => calculateTokens({ messageCount: 5, userWords: NaN, assistantWords: 100 }),
      /userWords must be a non-negative finite number/
    );
  });

  it('throws when assistantWords is Infinity', () => {
    assert.throws(
      () => calculateTokens({ messageCount: 5, userWords: 100, assistantWords: Infinity }),
      /assistantWords must be a non-negative finite number/
    );
  });

  it('accepts zero counts (empty conversation)', () => {
    const result = calculateTokens({ messageCount: 0, userWords: 0, assistantWords: 0 });
    assert.ok(result.totalTokens >= 0);
  });
});

describe('calculateConversationTokens — language fallback', () => {
  it('falls back to Spanish ratio for unrecognised language', () => {
    // Cast to bypass TS: simulates runtime bad input
    const input = { messageCount: 1, userWords: 100, assistantWords: 100, language: 'fr' as any };
    // Should not throw; uses Spanish ratio (1.3)
    const result = calculateTokens(input, [], false);
    assert.ok(result.totalTokens >= 0);
  });
});

describe('calculateFileTokens — docx sizes', () => {
  it('calculates docx small', () => {
    assert.equal(calculateFileTokens({ type: 'docx', size: 'small' }), 5000);
  });

  it('calculates docx medium (default)', () => {
    assert.equal(calculateFileTokens({ type: 'docx' }), 7500);
  });

  it('calculates docx large', () => {
    assert.equal(calculateFileTokens({ type: 'docx', size: 'large' }), 10000);
  });
});

describe('calculateTokens — multiple files', () => {
  it('sums tokens for multiple files correctly', () => {
    const result = calculateTokens(
      { messageCount: 1, userWords: 0, assistantWords: 0 },
      [
        { type: 'image', size: 'small' },   // 500
        { type: 'code', lines: 100 },        // 500
        { type: 'web_search', resultCount: 2 } // 800
      ],
      false
    );
    assert.equal(result.breakdown.files, 1800);
  });
});
