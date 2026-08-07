# Contributing to Token Calculator Suite

Thank you for your interest in contributing! This guide will help you get started.

---

## 🚀 Getting Started

### 1. Fork the repository
```bash
# Click "Fork" on GitHub
```

### 2. Clone your fork
```bash
git clone https://github.com/YOUR-USERNAME/token-calculator-suite.git
cd token-calculator-suite
```

### 3. Install dependencies
```bash
yarn install
```

### 4. Build and test
```bash
yarn build
yarn test
```

---

## 📝 Making Changes

### Code style
- Use TypeScript for new features
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Keep line length under 100 characters

### Testing
- Add tests for new calculations in `core/__tests__/`
- Test across all three platforms if affecting core
- Run `yarn test` before submitting PR

### Documentation
- Update README.md if changing public APIs
- Document new constants in `packages/core/src/constants.ts`
- Add examples for new features

---

## 🔧 Modifying Core Logic

If modifying `packages/core/`:

1. Edit `src/constants.ts` or `src/index.ts`
2. Run `yarn build`
3. Test in all three platforms:
   - Chat skill
   - Cowork plugin
   - Claude Code CLI

The changes automatically propagate to all platforms.

---

## 📤 Submitting Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Modify files
   - Add/update tests
   - Update documentation

3. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description

   Longer explanation if needed.
   - Point 1
   - Point 2"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to GitHub
   - Click "Compare & pull request"
   - Write clear description
   - Reference any issues: "Closes #123"

---

## 🐛 Bug Reports

Found a bug? Create an issue with:

- **Title**: Clear, concise description
- **Reproduction steps**: Exactly how to reproduce
- **Expected behavior**: What should happen
- **Actual behavior**: What's happening
- **Platform**: Chat / Cowork / Claude Code
- **Screenshots**: If applicable

---

## 💡 Feature Requests

Have an idea? Open an issue with:

- **Title**: Clear description of the feature
- **Use case**: Why this would be useful
- **Proposed solution**: How it could work
- **Alternatives**: Other approaches you've considered

---

## 📚 Project Structure

```
skills/                # Plugin skills — Cowork and Claude Code integration
packages/
├── core/              # Shared calculation logic
├── calculador-tokens-v2/  # Claude.ai integration (dir name = skill name)
└── cli/               # token-calc CLI (@token-calc/cli)
```

**Core changes affect everything.** Make sure to test broadly.

---

## 🔍 Code Review Process

1. Maintainers review your PR
2. May request changes or ask questions
3. Once approved, PR is merged
4. You'll be credited in release notes

---

## 📦 Release Process

We follow semantic versioning: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

Tags are created on main branch and published to npm.

---

## ❓ Questions?

- Ask in GitHub Issues
- Check existing documentation
- Look at similar PRs for patterns

---

## ✨ Thank You!

Your contributions make this tool better for everyone. We appreciate you! 🙏
