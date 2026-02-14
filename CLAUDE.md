# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **git-worktree-skill** — an interactive CLI installer that deploys a Git Worktree Management skill (as a proper `SKILL.md` with YAML frontmatter) to 8 AI coding assistants (Claude Code, GitHub Copilot, Windsurf, Cline, Gemini CLI, Roo Code, Codex CLI, OpenCode).

The tool is published as an npm package and run via `npx git-worktree-skill`.

## Commands

```bash
# Install dependencies
npm install

# Run the interactive installer
npm start          # or: node install.js

# Non-interactive install for specific agents
node install.js --install claude-code,cline

# List supported agents
node install.js --list

# Run tests
npm test
```

## Architecture

The project has four files:

- **`install.js`** — The entire installer logic. ESM module using `inquirer` for interactive prompts and `chalk` for terminal styling. Contains:
  - `AI_AGENTS` config object (line ~17): Maps each agent key to its name, description, skill directory paths (global vs project), default path choice, and docs URL. This is the single source of truth for adding new agent support.
  - Interactive flow: `selectAgents()` → `selectPathForAgent()` → `confirmInstallation()` → `performInstallation()`
  - Non-interactive flow: `nonInteractiveInstall()` handles `--install` flag with optional `--global`/`--project`/`--force` flags
  - File operations: `writeSkillFile()` handles create, overwrite, and duplicate detection (via "Git Worktree Management" string check)

- **`GIT-WORKTREE-PROMPT.md`** — The skill content that gets installed as `SKILL.md`. Has YAML frontmatter (`name`, `description`) followed by the full markdown instructions. Read at runtime by `getSkillContent()` with a minimal fallback if the file is missing.

- **`test.js`** — 45 tests using Node's built-in test runner (`node:test`). Tests run the CLI as a subprocess and verify output + file system effects. Run with `npm test`.

- **`package.json`** — Declares the `git-worktree-skill` bin entry pointing to `install.js`. Two runtime dependencies: `chalk` and `inquirer`.

## Key Patterns

- All skill files are installed as `<agent-dir>/skills/git-worktree/SKILL.md` following the Agent Skills standard.
- Agent path configs support both global (`~/` based) and project-relative paths. Path resolution happens in `performInstallation()` and `nonInteractiveInstall()`.
- Duplicate detection checks for "Git Worktree Management" string in existing files. The `--force` flag bypasses this check.
- The `files` array in package.json controls what ships to npm: `install.js`, `GIT-WORKTREE-PROMPT.md`, `README.md`.
