---
name: token-analyzer
description: "Automatically activates when user asks to analyze token usage in files, documents, or saved conversations within Cowork."
---

# Token Analyzer Skill

Analyzes token consumption for documents and conversations within Cowork.

## When it activates

- User asks "analyze tokens in this document"
- User wants to know "how many tokens is this file"
- User is reviewing document size before processing
- User needs to estimate API costs
- User wants token breakdown across multiple files

## What it does

1. **Identifies file type** (PDF, DOCX, images, code, etc.)
2. **Uses core calculation library** (`@token-calc/core`)
3. **Estimates tokens per file**
4. **Provides breakdown** (if multiple files)
5. **Suggests optimizations** (if helpful)

## Example workflow

**User**: "How many tokens is this 50-page PDF?"

**Claude** (via this skill):
```
📊 TOKEN ANALYSIS

File: document.pdf
Type: PDF (50 pages)
Estimated tokens: 15,000-17,000
Margin of error: ±18%

Breakdown:
  • PDF overhead: 500 tokens
  • 50 pages × 300 tokens/page: 15,000 tokens
  • Formatting overhead: 500 tokens

This is 7.5%-8.5% of your 200k context window.
```

## Technical notes

- Uses formulas from `@token-calc/core`
- Supports all file types in core library
- Works with Cowork file picker
- Can analyze multiple files in sequence

---

*Part of token-calculator-suite. Powered by shared core library.*
