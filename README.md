# 🧮 Token Calculator Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org)
[![Platforms](https://img.shields.io/badge/Platforms-Chat%20|%20Cowork%20|%20Code-brightgreen)](https://github.com/token-calculator-suite/token-calculator-suite)

**Unified token calculation system for Claude Chat, Cowork, and Claude Code.**

Reusable, open-source library for estimating Claude token consumption across three Anthropic platforms. Built with modularity, accuracy, and privacy in mind.

✨ **Features:**
- 📊 Accurate token estimation (±18% with exact data)
- 🔄 Single source of truth (shared core library)
- 🌍 Multi-platform: Chat, Cowork, Claude Code
- 🛡️ Privacy-first (Option C consent model)
- 📦 Production-ready TypeScript
- 📚 Fully documented with examples

---

## 📦 What's included

```
token-calculator-suite/
├── packages/
│   ├── core/                    ← Shared calculation logic
│   ├── chat-skill/              ← Claude.ai skill
│   ├── cowork-plugin/           ← Claude Cowork plugin
│   └── claude-code-mcp/         ← Claude Code CLI tool
├── README.md                    ← This file
└── package.json                 ← Monorepo config
```

---

## 🚀 Quick Start

### For Chat (claude.ai)

**Installation**: Copy `packages/chat-skill/SKILL.md` to your skills folder.

**Usage**:
```
/tokens
```

**Features**:
- ✅ Calculates tokens in current conversation
- ✅ Opción C: Asks permission before using personal data
- ✅ Accuracy: ±18% with exact data, ±22-30% without
- ✅ Real-time context usage tracking

---

### For Cowork

**Installation**: 
1. Zip `packages/cowork-plugin/` as `token-calculator.zip`
2. In Cowork: Customize > Plugins > Upload > Select zip

**Usage**:
```
/tokens:analyze        # Analyze current file
/tokens:report         # Generate token usage report
```

**Features**:
- ✅ Analyzes PDFs, DOCX, images, code files
- ✅ Generates batch reports for multiple files
- ✅ Suggests optimization opportunities
- ✅ Exports as CSV or table

---

### For Claude Code

This MCP server integrates token calculation directly into Claude Code, allowing you to estimate token usage and API costs while working on projects.

#### Prerequisites

- **Node.js 18.0.0 or higher** - Required for MCP server operation
- **Yarn 4.0.0+** - Used for dependency management in this monorepo
- **Git** - Required to clone the repository

#### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/token-calculator-suite/token-calculator-suite.git
   cd token-calculator-suite
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```
   
   This installs all workspace dependencies. The installation creates a `node_modules` directory and sets up workspace links.

3. **Build the MCP server**
   ```bash
   yarn workspace @token-calculator/claude-code-mcp build
   ```
   
   This compiles the TypeScript code into JavaScript in the `dist` directory. You should see output indicating successful compilation with no errors.

4. **Verify the build was successful**
   ```bash
   ls -la packages/claude-code-mcp/dist/
   ```
   
   You should see `mcp-server.js` in this directory.

5. **Configure Claude Code**
   
   Edit (or create) `~/.claude/settings.json` and add the MCP server configuration:
   
   ```json
   {
     "mcpServers": {
       "token-calculator": {
         "command": "node",
         "args": ["/full/path/to/token-calculator-suite/packages/claude-code-mcp/dist/mcp-server.js"],
         "type": "stdio"
       }
     }
   }
   ```
   
   **Important**: Replace `/full/path/to/token-calculator-suite` with the absolute full path to your cloned repository. You can find the full path by running `pwd` in the repository directory.

6. **Restart Claude Code**
   
   Close and reopen Claude Code. The token calculator MCP will be automatically loaded.

#### Troubleshooting

If the MCP server fails to start:

- **Check Node.js version**: Run `node --version` and ensure it's >= 18.0.0
- **Verify the build**: Ensure `packages/claude-code-mcp/dist/mcp-server.js` exists and is not empty
- **Check the path**: Ensure the `args` path in settings.json uses the absolute full path (starting with `/`) to the mcp-server.js file
- **Clear cache**: If you had build errors before, try `yarn clean` followed by `yarn install && yarn build`
- **Check logs**: Examine Claude Code's console output (View → Output in Claude Code) for detailed error messages

#### Features

Once installed, the token calculator MCP provides:
- ✅ Real-time token estimation for text
- ✅ File analysis (PDF, DOCX, images, code)
- ✅ API cost calculation for Claude models
- ✅ Multi-language support
- ✅ Batch processing support

---

## 📊 How It Works

### Core Library (`packages/core/`)

All platforms share a single source of truth:

```typescript
calculateTokens({
  messageCount: 50,
  userWords: 5000,
  assistantWords: 8000,
  language: 'es',
  useExactData: true
})
```

Returns:
```json
{
  "totalTokens": 28540,
  "minEstimate": 23000,
  "maxEstimate": 34000,
  "errorMarginPercent": "±18%",
  "contextUsage": {
    "tokensUsed": 28540,
    "tokensAvailable": 200000,
    "percentageUsed": 14.27
  },
  "confidence": "high"
}
```

### Accuracy Levels

| Condition | Error Margin | Confidence |
|-----------|--------------|------------|
| Exact data (Preferences + Memory) | ±18% | 🟢 High |
| Standard estimate | ±22% | 🟡 Medium |
| High uncertainty | ±30% | 🔴 Low |

### Supported File Types

| Type | Tokenization |
|------|--------------|
| **Images** | 500-1,500 tokens |
| **PDFs** | 300 tokens/page + overhead |
| **DOCX** | 5,000-10,000 tokens |
| **Code** | 5 tokens/line |
| **Web Search** | 400 tokens/result |

---

## 🔧 Architecture

### Three Tiers

```
┌─────────────────────────────────────────────────┐
│ PRESENTATION LAYER                              │
├──────────────┬──────────────┬──────────────────┤
│ Chat Skill   │ Cowork Plugin│ Claude Code CLI  │
├──────────────┴──────────────┴──────────────────┤
│ SHARED CORE LIBRARY (@token-calc/core)         │
├─────────────────────────────────────────────────┤
│ - Calculation algorithms                        │
│ - Constants & ratios                            │
│ - Language-specific tokenization                │
│ - Error margin logic                            │
└─────────────────────────────────────────────────┘
```

### Modification Guide

**To change a calculation formula**:
1. Edit `packages/core/src/index.ts`
2. Run `yarn build`
3. All platforms automatically use new logic

**To add a new file type**:
1. Add to `packages/core/src/constants.ts`
2. Implement in `calculateFileTokens()`
3. Available to all platforms immediately

---

## 📝 Configuration

### Language Support

```typescript
// Spanish (default)
calculateTokens({ language: 'es' })  // 1 word ≈ 1.3 tokens

// English
calculateTokens({ language: 'en' })  // 1 word ≈ 1.0 tokens
```

### Privacy (Option C)

First time only, asks for consent:

```
🔐 Can I use your Preferences + Memory for exact calculations?
[SÍ] [NO]
```

- **Yes**: ±18% accuracy (uses 3,468 exact tokens)
- **No**: ±22-30% accuracy (estimates only)

---

## 🎯 Use Cases

### Personal

- "How many tokens am I using this week?"
- "Will this PDF fit in my context window?"
- "Should I archive old conversations?"

### Team/Enterprise

- Token budget tracking across projects
- File size optimization recommendations
- Cost estimation for Claude API usage
- Compliance reporting (document processing)

### Developer

- Estimate API costs before calling Claude
- Optimize prompt engineering (token budgeting)
- Batch processing analysis
- Automated workflow optimization

---

## 🔐 Privacy & Security

✅ **No external data collection**
- All calculations run locally
- Personal data (Preferences/Memory) never sent anywhere
- Option C requires explicit consent before use

✅ **Transparent accuracy**
- Always shows error margins
- Distinguishes "known" vs "estimated" data
- Reports confidence levels

---

## 🤝 Contributing

All code is open source on GitHub.

### Setup dev environment

```bash
git clone https://github.com/token-calculator-suite/token-calculator-suite.git
cd token-calculator-suite
yarn install
yarn build
```

### To customize for your team

1. Fork repo
2. Edit constants in `packages/core/src/constants.ts`
3. Customize skills/commands for your workflow
4. Deploy to your Cowork/Code instances

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `packages/core/README.md` | Core library API |
| `packages/chat-skill/SKILL.md` | Chat skill usage |
| `packages/cowork-plugin/.claude-plugin/plugin.json` | Plugin manifest |
| `packages/claude-code-mcp/src/mcp-server.ts` | CLI commands |

---

## 🐛 Known Limitations

- System prompt estimation is ±1.5k tokens (not observable)
- Web search results compression varies (±20%)
- Language detection not automatic (must specify `--lang`)
- Concurrent file analysis in Cowork not optimized for >100 files

---

## 📞 Support

- **Bug reports**: GitHub Issues
- **Feature requests**: GitHub Discussions
- **Custom integrations**: Contact maintainers

---

## 📄 License

MIT License. Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

Built with modularity first, tested across three Anthropic platforms.

**Last updated**: March 2026
**Maintainers**: Token Calculator Suite Contributors

---

*Part of token-calculator-suite. Made for accuracy, privacy, and reusability.*
