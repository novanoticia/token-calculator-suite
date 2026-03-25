---
name: project-cost
description: Estimate total API costs for projects and workflows. Use when the user wants to budget for API usage, plan a project involving multiple Claude calls, or understand the cost of automating a workflow.
user-invocable: true
---

# Project Cost Estimation

Estimate total API costs for multi-step projects and recurring workflows.

## Gathering requirements

Ask the user about:
1. **Task type**: What will Claude do? (writing, analysis, coding, classification, etc.)
2. **Volume**: How many items/documents/requests?
3. **Input size**: Average size of each input (words, pages, or tokens)
4. **Output size**: Expected output length per request
5. **Frequency**: One-time or recurring? If recurring, how often?
6. **Model preference**: Which model tier? (default to Sonnet if unsure)

## Cost calculation method

For each step in the workflow:
1. Estimate input tokens (content + system prompt + conversation history)
2. Estimate output tokens (expected response length)
3. Apply model pricing
4. Multiply by volume
5. Add buffer of 20% for retries, errors, and prompt iteration

## Common workflow templates

### Document processing pipeline
- Input: document tokens + system prompt (~500 tokens)
- Output: typically 20-40% of input length for summaries, 5-10% for extraction
- Factor: number of documents

### Content generation
- Input: brief/instructions (~1000 tokens) + reference material
- Output: 500-3000 tokens per piece typically
- Factor: number of pieces

### Classification/triage
- Input: item text + classification criteria (~800 tokens)
- Output: ~200 tokens per classification
- Factor: number of items (often high volume, use Haiku)

### Code generation
- Input: spec + context (~2000 tokens)
- Output: 500-5000 tokens per component
- Factor: number of components

## Output format

Present as a cost breakdown table:

| Step | Model | Requests | Input tok/req | Output tok/req | Cost |
|------|-------|----------|--------------|----------------|------|
| ... | ... | ... | ... | ... | ... |
| **Total** | | | | | **$X.XX** |

Then add:
- **Monthly projection**: if recurring
- **Annual projection**: if recurring
- **Cost optimization tips**: specific to their workflow
- **Break-even analysis**: vs manual labor cost if relevant
