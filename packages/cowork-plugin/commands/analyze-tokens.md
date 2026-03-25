---
name: analyze-tokens
command: "/tokens:analyze"
description: "Analyze token consumption of the current document or file"
---

# /tokens:analyze

Slash command to analyze tokens in the current document.

## Usage

```
/tokens:analyze
```

## What happens

1. Claude identifies the current file type
2. Estimates tokens using core library
3. Shows breakdown and context usage
4. Suggests optimizations (if applicable)

## Example

**Input**: `/tokens:analyze` (while editing document.pdf)

**Output**:
```
📊 TOKEN ANALYSIS - document.pdf

Estimated tokens: 12,500-14,800
Margin: ±18%
Context usage: 6.25%-7.4% of 200k window

This document is ready to analyze with Claude.
```

## Works with

- PDFs
- DOCX files
- Images
- Code files
- Text files

---

*Part of token-calculator-suite. Powered by shared core library.*
