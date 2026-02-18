# Git Worktree Skill

Interactive installer for Git Worktree Management skill. Creates proper `SKILL.md` files following the [Agent Skills standard](https://agentskills.io/specification).

<img src="https://raw.githubusercontent.com/jparkerweb/ai-skill--git-worktree/main/docs/banner.jpg" height="250" />

## Quick Install

```bash
npx git-worktree-skill
```

Or clone and run locally:
```bash
git clone https://github.com/jparkerweb/ai-skill--git-worktree
cd ai-skill--git-worktree
npm install
npm start
```

## Supported AI Agents

| Agent | Key | Skill Location |
|-------|-----|----------------|
| **Claude Code** | `claude-code` | `.claude/skills/git-worktree/SKILL.md` |
| **GitHub Copilot** | `github-copilot` | `.github/skills/git-worktree/SKILL.md` |
| **Windsurf** | `windsurf` | `.cascade/skills/git-worktree/SKILL.md` |
| **Cline** | `cline` | `.cline/skills/git-worktree/SKILL.md` |
| **Gemini CLI** | `gemini-cli` | `.gemini/skills/git-worktree/SKILL.md` |
| **Roo Code** | `roo-code` | `.roo/skills/git-worktree/SKILL.md` |
| **Cursor** | `cursor` | `.cursor/skills/git-worktree/SKILL.md` |
| **Codex CLI** | `codex` | `.agents/skills/git-worktree/SKILL.md` |
| **OpenCode** | `opencode` | `.opencode/skills/git-worktree/SKILL.md` |

All agents also support global installation (e.g., `~/.claude/skills/git-worktree/SKILL.md`).

## CLI Options

```bash
# Interactive installation (select agents with arrow keys)
npx git-worktree-skill

# Non-interactive install for specific agents
npx git-worktree-skill --install claude-code,cline,windsurf

# Install with global paths preference
npx git-worktree-skill --install claude-code --global

# Install with project paths preference
npx git-worktree-skill --install windsurf --project

# Show version
npx git-worktree-skill --version

# Force overwrite existing skill files
npx git-worktree-skill --install claude-code --force

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
3. **Handle conflicts** - Overwrite or skip existing skill files
4. **View summary** - See all installed locations

## What Gets Installed

Each agent receives a `SKILL.md` file with YAML frontmatter and comprehensive instructions:

```yaml
---
name: git-worktree
description: Git Worktree Management Assistant - guides users in creating, managing, and removing Git worktrees for parallel development workflows
license: Apache-2.0
compatibility: Requires git
---
```

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

If you prefer manual installation, copy `GIT-WORKTREE-PROMPT.md` into a `git-worktree/SKILL.md` file inside your agent's skills directory.

## Files

| File | Purpose |
|------|---------|
| `install.js` | Interactive installer script |
| `GIT-WORKTREE-PROMPT.md` | The skill content (with YAML frontmatter) |
| `scripts/setup-worktree.sh` | Automated setup script for worktrees |
| `package.json` | Node.js package configuration |

## License

Apache-2.0
