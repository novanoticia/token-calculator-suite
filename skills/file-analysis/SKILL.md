---
name: file-analysis
description: Estimate token consumption of files before uploading to Claude. Use when the user wants to know how much context a file will consume, whether a file fits in the context window, or needs to plan which files to include in a conversation.
user-invocable: true
---

# File Analysis for Context Planning

Help users understand how much context window their files will consume.

## File type token estimates

| File type | Estimation method |
|-----------|-------------------|
| Plain text (.txt, .md) | Characters / 4 (English) or / 3 (Spanish) |
| PDF | ~1500 tokens per page (text-heavy), ~800 per page (sparse) |
| Images (PNG, JPG) | ~1600 tokens per image (fixed overhead for vision) |
| Code files | Characters / 3.5 |
| CSV/spreadsheet | Characters / 3 (includes structural overhead) |
| DOCX | Similar to plain text after extraction |

## When analyzing files

1. Identify the file type and size
2. Apply the appropriate estimation method
3. Calculate percentage of context window consumed
4. Determine if multiple files fit together
5. Suggest an upload strategy if total exceeds limits

## Multi-file planning

When users have multiple files:
- List each file with its estimated token cost
- Show cumulative total
- Show remaining context for the conversation itself
- Recommend which files to prioritize if total exceeds window
- Suggest alternatives (summarize first, split across conversations)

## Output format

For each file:
- **File**: name and type
- **Size**: in KB/MB
- **Estimated tokens**: with method used
- **Context impact**: percentage of 200K window (per conversation, as documented by Anthropic)

Summary:
- **Total tokens**: all files combined
- **Remaining context**: tokens left for conversation
- **Recommendation**: fit/split/summarize
