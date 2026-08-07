# 🧮 Token Calculator Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org)
[![Platforms](https://img.shields.io/badge/Platforms-Chat%20|%20Cowork%20|%20Code-brightgreen)](https://github.com/token-calculator-suite/token-calculator-suite)

> **Conforms to [Agent Plugins 1.0.0](https://agent-plugins.org/specification)** — the
> portable packaging format from the Agentic AI Foundation (OpenAI, Amazon, Microsoft,
> Cursor and Vercel, with Google as core maintainer). The repository root is the plugin
> root: it carries the portable `plugin.json` manifest alongside `.claude-plugin/` and
> the four skills in `skills/token-analysis/`, `skills/file-analysis/`,
> `skills/project-cost/` and `skills/model-comparison/`, so any conformant client
> discovers them.
>
> **Works in ChatGPT.** The skills are plain text — instructions and criteria, no local
> execution — so they upload as-is via *Plugins → Skills → Create → Upload from your
> computer* and behave the same as in Claude. Their frontmatter validates against the
> closed [Agent Skills](https://agentskills.io/specification) field set, which is what
> ChatGPT, claude.ai and the Skills API require to accept an upload: an extra key there
> is not ignored, it fails hard. ChatGPT *Skills* require a Business, Enterprise,
> Healthcare or Edu plan.

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
├── skills/                      ← Plugin skills (Cowork + Claude Code)
├── plugin.json                  ← Agent Plugins 1.0.0 manifest
├── .claude-plugin/              ← Claude Code manifest + marketplace entry
├── packages/
│   ├── core/                    ← Shared calculation logic
│   ├── calculador-tokens-v2/    ← Claude.ai skill
│   └── cli/                     ← token-calc CLI (@token-calc/cli)
├── README.md                    ← This file
└── package.json                 ← Monorepo config
```

---

## 🚀 Quick Start

### For Chat (claude.ai)

**Installation**: Copy the whole `packages/calculador-tokens-v2/` directory into
your skills folder. Copy the directory, not just the `SKILL.md`: the Agent Skills
spec requires the folder name to match the frontmatter `name`, which is what
identifies the skill.

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
1. Zip the repository root (it is the plugin root: `plugin.json`, `.claude-plugin/`
   and `skills/` all live there) as `token-calculator.zip`
2. In Cowork: Customize > Plugins > Upload > Select zip

**Usage**:
```
/token-calculator:token-analysis     # Analyze text for token count and cost
/token-calculator:file-analysis      # Estimate a file's token consumption
/token-calculator:project-cost       # Estimate total API cost for a project
/token-calculator:model-comparison   # Compare models by cost and context window
```

**Features**:
- ✅ Analyzes PDFs, DOCX, images, code files
- ✅ Generates batch reports for multiple files
- ✅ Suggests optimization opportunities
- ✅ Exports as CSV or table

---

### For Claude Code

Two independent ways to use this in Claude Code. They are not alternatives to each
other — most people want the first.

| What | What you get | Setup |
|---|---|---|
| **Plugin skills** | The four skills in `skills/`, invoked as `/token-calculator:token-analysis` and friends. Pure text, no build. | Install the plugin (see below) |
| **`token-calc` CLI** | A terminal command Claude can run through the Bash tool, printing a token breakdown plus JSON. | Clone and build (see below) |

> **This package is a CLI, not an MCP server.** Earlier revisions of this section
> described registering a `dist/mcp-server.js` under `mcpServers`. That file does not
> exist and never did: the package (`@token-calc/cli`) has no MCP SDK dependency and
> implements no JSON-RPC. Its build output is `dist/cli.js`, a `token-calc` executable.
> If you followed those instructions and got stuck looking for `mcp-server.js`, that is
> why. See [issue #1](https://github.com/novanoticia/token-calculator-suite/issues/1).

#### Option A — Install the plugin (skills only, no build)

```
/plugin marketplace add https://github.com/novanoticia/token-calculator-suite
/plugin install token-calculator@token-calculator-suite
/reload-plugins
```

Then invoke any of the four skills:

```
/token-calculator:token-analysis      # tokens and cost for a chunk of text
/token-calculator:file-analysis       # what a file will cost in context
/token-calculator:project-cost        # total API cost for a project
/token-calculator:model-comparison    # models by cost and context window
```

Nothing to compile: the skills are Markdown.

#### Option B — Build the `token-calc` CLI

**Prerequisites**

- **Node.js 18.0.0 or higher** (`node --version`)
- **Yarn 4 (Berry)**. This matters: the workspaces use the `workspace:*` protocol and
  the lockfile is Berry v8. Yarn Classic (1.x) **fails outright** with
  `Couldn't find package "@token-calc/core@workspace:*" ... on the "npm" registry`.
  Enable Berry with `corepack enable && yarn set version stable`.
- **Git**

**Steps**

1. **Clone**
   ```bash
   git clone https://github.com/novanoticia/token-calculator-suite.git
   cd token-calculator-suite
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```
   `.yarnrc.yml` already sets `nodeLinker: node-modules`, so this produces a real
   `node_modules` tree rather than Yarn PnP.

3. **Build**
   ```bash
   yarn build
   ```
   This builds `@token-calc/core` and then `@token-calc/cli`, in that order — the CLI
   depends on core. To build just one: `yarn build:core` or `yarn build:cli`.

4. **Verify**
   ```bash
   ls packages/cli/dist/
   ```
   You should see **`cli.js`**. That is the executable the `token-calc` bin points to.

5. **Run it**
   ```bash
   node packages/cli/dist/cli.js tokens \
     --messages 50 --user-words 5000 --assistant-words 8000 --lang es

   node packages/cli/dist/cli.js convert --words 1000 --lang es
   node packages/cli/dist/cli.js file --path ./document.pdf
   node packages/cli/dist/cli.js help
   ```
   To get a bare `token-calc` on your `PATH`, link the package once. `npm link` is the
   one that creates a global bin — Yarn Berry's `yarn link` does something different
   (it links a package *into another project*, not onto your `PATH`):
   ```bash
   cd packages/cli && npm link && cd -
   token-calc help
   ```
   Or skip linking and add an alias:
   ```bash
   alias token-calc="node $(pwd)/packages/cli/dist/cli.js"
   ```

6. **Use it from Claude Code**

   There is nothing to configure. Claude runs it through the Bash tool like any other
   command — just tell it what you want, mentioning the path or the linked binary:

   > *"Run token-calc on ./informe.pdf and tell me if it fits in the context window"*

   To let Claude call it without asking permission each time, add it to your
   [allowed tools](https://code.claude.com/docs/en/settings), for example
   `Bash(token-calc:*)`.

#### Troubleshooting

- **`Couldn't find package "@token-calc/core@workspace:*"`** — you are on Yarn Classic.
  Run `corepack enable && yarn set version stable`, then `yarn install` again.
- **`yarn build` compiles core but not the CLI** — you are on a revision from before
  the root `build` script chained both. Use `yarn build:cli` directly.
- **Looking for `mcp-server.js`** — it does not exist. The build output is
  `packages/cli/dist/cli.js`. See the note at the top of this section.
- **Type errors about `process` or `fs`** — `@types/node` must be installed at the
  root; it is already in the root `devDependencies`, so re-run `yarn install`.
- **`Unknown command: undefined`** — you ran the CLI with no arguments. That message is
  followed by the usage text; pick one of `tokens`, `file`, `convert`, `help`.

#### What the CLI gives you

- ✅ Token estimation for a conversation, with a min–max range and a confidence level
- ✅ File analysis (PDF, DOCX, images, code) by path or by type and size
- ✅ Word and character conversion, language-aware (ES/EN)
- ✅ Context-window usage as an absolute figure and a percentage
- ✅ Human-readable output plus a JSON block for piping

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
| `packages/calculador-tokens-v2/SKILL.md` | Chat skill usage |
| `plugin.json` | Portable plugin manifest (Agent Plugins 1.0.0) |
| `.claude-plugin/plugin.json` | Claude Code plugin manifest |
| `skills/*/SKILL.md` | Plugin skills |
| `packages/cli/src/cli.ts` | `token-calc` CLI commands |

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
