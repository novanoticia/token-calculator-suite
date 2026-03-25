/**
 * Token Calculator MCP Server
 * Exposes core token calculation library via MCP protocol
 * For use with Claude Code and terminal
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  calculateTokens,
  calculateFileTokens,
  formatTokenResult,
  wordsToTokens,
  charsToTokens,
  type ConversationInput,
  type FileInput,
  type TokenCalculationResult
} from '@token-calc/core';

// ============================================
// CLI INTERFACE
// ============================================

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'tokens':
        handleTokensCommand(args);
        break;

      case 'file':
        handleFileCommand(args);
        break;

      case 'convert':
        handleConvertCommand(args);
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// ============================================
// COMMAND HANDLERS
// ============================================

function handleTokensCommand(args: string[]) {
  /**
   * Usage: claude token-calc tokens --messages 50 --user-words 5000 --assistant-words 8000 --lang es
   */

  const messageCount = parseInt(getArgValue(args, '--messages') || '0');
  const userWords = parseInt(getArgValue(args, '--user-words') || '0');
  const assistantWords = parseInt(getArgValue(args, '--assistant-words') || '0');
  const lang = (getArgValue(args, '--lang') || 'es') as 'es' | 'en';
  const useExactData = getArgValue(args, '--exact-data') !== 'false';

  if (messageCount === 0 || (userWords === 0 && assistantWords === 0)) {
    console.error('Error: --messages and (--user-words or --assistant-words) required');
    process.exit(1);
  }

  const input: ConversationInput = {
    messageCount,
    userWords,
    assistantWords,
    language: lang,
    useExactData
  };

  const result = calculateTokens(input);
  console.log(formatTokenResult(result));
  console.log('\nJSON Output:');
  console.log(JSON.stringify(result, null, 2));
}

function handleFileCommand(args: string[]) {
  /**
   * Usage: claude token-calc file --type pdf --pages 50
   *        claude token-calc file --type docx --size large
   *        claude token-calc file --path ./document.pdf
   */

  const filePath = getArgValue(args, '--path');
  const fileType = (getArgValue(args, '--type') || 'pdf') as FileInput['type'];
  const size = (getArgValue(args, '--size') || 'medium') as 'small' | 'medium' | 'large';
  const pages = parseInt(getArgValue(args, '--pages') || '0');
  const lines = parseInt(getArgValue(args, '--lines') || '0');

  let file: FileInput;

  if (filePath) {
    // Analyze actual file
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const stats = fs.statSync(filePath);
    const sizeInKB = stats.size / 1024;

    let detectedType: FileInput['type'] = 'docx';
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') detectedType = 'pdf';
    else if (ext === '.docx') detectedType = 'docx';
    else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) detectedType = 'image';
    else if (['.js', '.ts', '.py', '.rb', '.java'].includes(ext)) detectedType = 'code';

    file = {
      type: detectedType,
      size: sizeInKB > 5000 ? 'large' : sizeInKB > 1000 ? 'medium' : 'small'
    };

    console.log(`📄 File: ${path.basename(filePath)}`);
    console.log(`   Size: ${(sizeInKB / 1024).toFixed(2)} MB`);
  } else {
    // Use provided parameters
    file = { type: fileType };

    if (size) file.size = size;
    if (pages) file.pages = pages;
    if (lines) file.lines = lines;
  }

  const tokens = calculateFileTokens(file);

  console.log(`\n📊 TOKEN ESTIMATE`);
  console.log(`   Type: ${file.type}`);
  console.log(`   Estimated tokens: ${tokens}`);
  console.log(`   Context usage: ${((tokens / 200000) * 100).toFixed(2)}%`);
  console.log('\nJSON Output:');
  console.log(JSON.stringify({ file, tokens }, null, 2));
}

function handleConvertCommand(args: string[]) {
  /**
   * Usage: claude token-calc convert --words 5000 --lang es
   *        claude token-calc convert --chars 20000 --lang en
   */

  const words = parseInt(getArgValue(args, '--words') || '0');
  const chars = parseInt(getArgValue(args, '--chars') || '0');
  const lang = (getArgValue(args, '--lang') || 'es') as 'es' | 'en';

  if (words === 0 && chars === 0) {
    console.error('Error: --words or --chars required');
    process.exit(1);
  }

  console.log(`\n📐 CONVERSION (${lang.toUpperCase()})`);

  if (words > 0) {
    const tokens = wordsToTokens(words, lang);
    console.log(`   ${words} words → ${tokens} tokens`);
  }

  if (chars > 0) {
    const tokens = charsToTokens(chars, lang);
    console.log(`   ${chars} characters → ${tokens} tokens`);
  }
}

// ============================================
// HELPERS
// ============================================

function getArgValue(args: string[], flag: string): string | null {
  const index = args.indexOf(flag);
  return index !== -1 && index < args.length - 1 ? args[index + 1] : null;
}

function showHelp() {
  console.log(`
🧮 Token Calculator for Claude Code

USAGE:
  claude token-calc <command> [options]

COMMANDS:
  tokens      Calculate tokens from conversation
  file        Analyze file tokens
  convert     Convert words/chars to tokens
  help        Show this help

EXAMPLES:

  # Calculate conversation tokens
  claude token-calc tokens \\
    --messages 50 \\
    --user-words 5000 \\
    --assistant-words 8000 \\
    --lang es

  # Analyze a file
  claude token-calc file --path ./document.pdf
  claude token-calc file --type docx --size large

  # Convert units
  claude token-calc convert --words 1000 --lang es
  claude token-calc convert --chars 5000 --lang en

OPTIONS:
  --exact-data    Use exact Preferences+Memory (default: true)
  --lang          Language: es | en (default: es)
  --json          Output as JSON (automatic)

---
Part of token-calculator-suite
https://github.com/token-calculator-suite
`);
}

// ============================================
// START
// ============================================

main().catch(console.error);
