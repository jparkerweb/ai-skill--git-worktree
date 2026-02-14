# Git Worktree Skill

Interactive installer for Git Worktree Management skill. Works with 14+ AI coding assistants.

<img src="https://raw.githubusercontent.com/jparkerweb/ai-skill--git-worktree/main/docs/banner.jpg" height="250" />

## Quick Install

```bash
npx git-worktree-skill
```

Or clone and run locally:
```bash
git clone https://github.com/youruser/git-worktree-skill
cd git-worktree-skill
npm install
npm start
```

## Supported AI Agents

| Agent | Key | File Location |
|-------|-----|---------------|
| **Claude Code** | `claude-code` | `~/.claude/commands/git-worktree.md` |
| **GitHub Copilot** | `github-copilot` | `.github/instructions/git-worktree.instructions.md` |
| **Copilot CLI** | `copilot-cli` | `~/.config/gh-copilot/instructions.md` |
| **Cursor** | `cursor` | `.cursorrules` or `~/.cursor/rules/` |
| **Windsurf** | `windsurf` | `.windsurfrules` or `.windsurf/rules/` |
| **Gemini CLI** | `gemini-cli` | `GEMINI.md` |
| **Cline** | `cline` | `.clinerules` or `.cline/rules/` |
| **Continue** | `continue` | `.continuerules` or `.continue/rules/` |
| **Zed** | `zed` | `.rules` or `~/.config/zed/rules/` |
| **Aider** | `aider` | `.aider/conventions.md` |
| **OpenCode** | `opencode` | `AGENTS.md` |
| **Roo Code** | `roo-code` | `.roo/rules/` |
| **Codex CLI** | `codex` | `AGENTS.md` |

## CLI Options

```bash
# Interactive installation (select agents with arrow keys)
npx git-worktree-skill

# Non-interactive install for specific agents
npx git-worktree-skill --install claude-code,cursor,windsurf

# Install with global paths preference
npx git-worktree-skill --install claude-code --global

# Install with project paths preference
npx git-worktree-skill --install cursor,cline --project

# Show help
npx git-worktree-skill --help

# List supported agents
npx git-worktree-skill --list

# Show documentation links
npx git-worktree-skill --docs
```

## Interactive Mode

When run without `--install`, the installer provides an interactive experience:

1. **Select agents** - Use spacebar to toggle, enter to confirm
2. **Choose paths** - Pick global or project-level installation
3. **Handle conflicts** - Append, overwrite, or skip existing files
4. **View summary** - See all installed locations

## What Gets Installed

The skill provides your AI assistant with:

- **Quick reference** for all worktree commands
- **Step-by-step workflows** for common scenarios
- **Troubleshooting guide** for common issues
- **Interactive guidance** protocol for helping users
- **Environment setup** templates (Node.js, Python)

## Example Usage

After installation, ask your AI assistant:

- "Help me create a worktree for a new feature"
- "List my current worktrees"
- "How do I switch between worktrees?"
- "Clean up my old worktrees"
- "What are the benefits of worktrees vs stashing?"

## Manual Installation

If you prefer manual installation, copy the contents of `GIT-WORKTREE-PROMPT.md` to the appropriate location for your AI agent.

## Files

| File | Purpose |
|------|---------|
| `install.mjs` | Interactive installer script |
| `GIT-WORKTREE-PROMPT.md` | The skill content |
| `package.json` | Node.js package configuration |

## License

MIT
