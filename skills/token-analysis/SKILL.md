---
name: token-analysis
description: Analyze text for token count estimation and API cost calculation. Use when the user asks about tokens, costs, context window usage, or wants to optimize prompt length.
---

# Token Analysis

Estimate token counts and API costs for text content.

## Token estimation rules

These ratios match `@token-calc/core` constants (`TOKENIZATION_RATIOS`):

- **English**: 1 token ≈ 4 characters (`charsToTokens: 0.25`)
- **Spanish**: 1 token ≈ 3 characters (`charsToTokens: 0.33`)
- **Code**: 1 token ≈ 3.5 characters
- **Mixed content**: use weighted average based on language proportion

## When the user provides text or a file

1. Count the characters in the content
2. Identify the primary language
3. Apply the appropriate ratio
4. Report the estimated token count

## Cost reference (early 2026)

| Model | Input/MTok | Output/MTok |
|-------|-----------|-------------|
| Opus 4.6 | $15.00 | $75.00 |
| Sonnet 4.6 | $3.00 | $15.00 |
| Haiku 4.5 | $0.80 | $4.00 |

## Context window reference

> Note: 200K tokens is the limit **per conversation**, as documented publicly by Anthropic.

| Tier | Tokens | Scope |
|------|--------|-------|
| Claude web standard | 200K | per conversation |
| Claude API standard | 200K | per conversation |
| Claude API extended | 1M | per conversation |

## Output format

Always report:
- **Character count**: exact number
- **Estimated tokens**: with language ratio used
- **Context window usage**: percentage of 200K and 1M windows
- **Cost estimate**: for all three model tiers (input cost)
- **Optimization tip**: if usage exceeds 50% of standard window, suggest strategies

## Optimization strategies

When context usage is high, suggest:
- Summarize long documents before including them
- Use system prompts efficiently (they count as input tokens)
- Split large tasks into smaller conversations
- Use Haiku for simple tasks, reserve Opus for complex reasoning
