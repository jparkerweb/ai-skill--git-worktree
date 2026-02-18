# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-02-17

### Added
- **Cursor support** — new `cursor` agent with project and global skill paths
- **Automated setup script** (`scripts/setup-worktree.sh`) — auto-detects project type (npm/pnpm/yarn/pip), installs dependencies, and copies environment files into new worktrees
- **`--version` / `-v` flag** — prints the current package version
- **Multi-folder workspace tips** in skill prompt for Cursor, Windsurf, VS Code, and Trae
- **Post-creation setup workflow** section in the skill prompt documenting the automated setup script
- Scripts directory is now copied alongside `SKILL.md` during installation

### Changed
- Help output and README updated to reflect Cursor support and `--version` flag
- README license corrected from MIT to Apache-2.0
- Extended test suite to cover Cursor agent and setup script installation

### Fixed
- Package manager detection order in `setup-worktree.sh` (lock files now checked before `package.json`)
- `--version` flag no longer prints the decorative banner

### Supported Agents
- Claude Code, GitHub Copilot, Windsurf, Cline, Cursor
- Gemini CLI, Roo Code, Codex CLI, OpenCode

## [1.1.1] - 2026-02-13

### Added
- Full test suite (45 tests) using Node's built-in test runner (`npm test`)

### Fixed
- `--force` flag now correctly bypasses duplicate detection in `writeSkillFile()`
- `printFinalSummary()` no longer crashes when displaying unknown agent names

### Changed
- Updated CLAUDE.md to reflect current architecture, commands, and file structure
- Updated package.json keywords to match current supported agents

## [1.1.0] - 2026-02-13

### Changed
- Converted to real SKILL.md format with YAML frontmatter following the Agent Skills standard
- Skills now install as standalone `SKILL.md` files in dedicated `git-worktree/` directories
- Removed agents without native SKILL.md support (Cursor, Continue, Zed, Aider, Copilot CLI, Custom)
- Removed append-to-config mode (skills are now self-contained files)
- Simplified conflict handling to overwrite or skip (no append)

### Added
- `--force` flag for non-interactive overwrite of existing skill files
- YAML frontmatter (`name`, `description`) in the skill content

### Supported Agents
- Claude Code, GitHub Copilot, Windsurf, Cline
- Gemini CLI, Roo Code, Codex CLI, OpenCode

## [1.0.1] - 2026-02-13

### Fixed
- README banner image broken on npm (use absolute GitHub raw URL)

## [1.0.0] - 2026-02-13

### Added
- Interactive CLI installer for Git Worktree Management skill
- Support for 14+ AI coding assistants:
  - Claude Code, Cursor, GitHub Copilot, Copilot CLI
  - Windsurf, Gemini CLI, Cline, Continue
  - Zed, Aider, OpenCode, Roo Code, Codex CLI
  - Custom path option
- Non-interactive installation via `--install` flag with comma-separated agent keys
- Global (`--global`) and project (`--project`) path preferences
- Append, overwrite, or skip options for existing files
- Duplicate detection to prevent re-installing the same skill
- `--list` flag to show all supported agents
- `--docs` flag to show documentation links
- Exit option in the interactive agent selection list
