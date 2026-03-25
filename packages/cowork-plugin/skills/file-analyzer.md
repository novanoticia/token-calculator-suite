---
name: file-analyzer
description: "Activates when analyzing multiple files or generating token usage reports for projects/folders in Cowork."
---

# File Analyzer Skill

Generates token analysis reports for multiple files and projects.

## When it activates

- User has multiple files and wants total token estimate
- User is planning to upload a set of documents
- User needs a project-wide token budget
- User wants to optimize file organization

## What it does

1. **Catalogs all files** in a folder or selection
2. **Calculates tokens per file**
3. **Sums totals**
4. **Generates report** (table format)
5. **Suggests optimizations** (prioritize, compress, archive)

## Report format

```
📊 TOKEN USAGE REPORT - Project X

Total files: 12
Total tokens (estimated): 87,500 - 105,000
Margin: ±20%

FILE BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File | Type | Tokens | % of Total
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
report.pdf | PDF | 18,500 | 21%
data.xlsx | XLSX | 12,000 | 14%
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:
  • Largest file: report.pdf (18,500 tokens)
  • File type distribution: 40% PDFs, 30% DOCX, 20% Images, 10% Code
  • Optimization opportunity: Archive 3 old PDFs = save ~15k tokens
```

## Technical notes

- Recursively analyzes folders
- Uses Cowork file picker API
- Exports to CSV if requested
- Updates in real-time as files change

---

*Part of token-calculator-suite. Powered by shared core library.*
