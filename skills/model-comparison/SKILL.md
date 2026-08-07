---
name: model-comparison
description: Compare AI models by capability, cost, context window, and best use cases. Use when the user asks which model to use, compares Claude vs GPT vs Gemini vs DeepSeek, or needs help choosing the right model for a task.
---

# AI Model Comparison Guide

Help users choose the right model for their task based on capabilities, cost, and context.

## Claude model lineup (Anthropic, early 2026)

| Model | Strengths | Context | Input/MTok | Output/MTok |
|-------|-----------|---------|-----------|-------------|
| Opus 4.6 | Most capable, deep reasoning, complex analysis | 200K (1M API) | $15.00 | $75.00 |
| Sonnet 4.6 | Best balance of speed and capability | 200K (1M API) | $3.00 | $15.00 |
| Haiku 4.5 | Fastest, cheapest, good for simple tasks | 200K | $0.80 | $4.00 |

## Competitor reference (approximate, verify current data)

| Model | Provider | Context | Relative cost |
|-------|----------|---------|---------------|
| GPT-5 / GPT-4.1 | OpenAI | 128K-1M | Medium-High |
| Gemini 2.5 Pro | Google | 1M-2M | Medium |
| DeepSeek V3 / R1 | DeepSeek | 128K | Very Low |

## Decision framework

When the user asks which model to use:

1. **Task complexity**: Simple extraction/formatting → Haiku. Analysis/writing → Sonnet. Deep reasoning/research → Opus.
2. **Speed needs**: Latency-sensitive → Haiku. Balanced → Sonnet. Quality over speed → Opus.
3. **Budget**: Cost-sensitive → Haiku or DeepSeek. Standard → Sonnet. Premium → Opus.
4. **Context needs**: Under 100K tokens → any model. 100K-200K → Claude or Gemini. Over 200K → Gemini or Claude API extended.
5. **Privacy**: Maximum privacy → local models or DeepSeek self-hosted. Cloud with policies → Claude or GPT.

## Output format

- **Recommended model**: with reasoning
- **Alternative**: second choice with tradeoff explanation
- **Cost estimate**: for the specific task described
- **Caveat**: note that competitor pricing and capabilities change frequently

## Important notes

- Always recommend searching for the latest pricing, as it changes frequently
- Be transparent about limitations of each model
- Note that benchmarks do not always reflect real-world performance
- Suggest the user test with their specific use case when choosing between close options
