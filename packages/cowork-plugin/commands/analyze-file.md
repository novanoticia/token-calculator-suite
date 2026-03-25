---
name: analyze-file
command: "/tokens:report"
description: "Generate a comprehensive token usage report for selected files"
---

# /tokens:report

Generate a detailed report of token usage across multiple files.

## Usage

```
/tokens:report [folder or file selection]
```

## What happens

1. Analyzes all selected files
2. Calculates tokens per file
3. Generates CSV/table report
4. Identifies optimization opportunities
5. Exports recommendations

## Example

**Input**: `/tokens:report` (with Documents folder selected)

**Output**:
```
📊 TOKEN USAGE REPORT - Documents/

Total files: 8
Total tokens: 45,000-54,000
Margin: ±20%

[Table with breakdown]

OPTIMIZATION TIPS:
  • Combine 3 small PDFs into 1 (save ~2k tokens, improve readability)
  • Archive 2019 data (save ~12k tokens)
  • Convert images to PDF (save ~5k tokens)

Estimated savings: ~19,000 tokens (42% reduction)
```

## Options

- `--export csv` — Export table as CSV
- `--detailed` — Include per-page breakdown
- `--lang es` or `--lang en` — Tokenize for Spanish or English

---

*Part of token-calculator-suite. Powered by shared core library.*
