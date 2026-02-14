# Changelog

All notable changes to this project will be documented in this file.

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
