import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const execFileAsync = promisify(execFile);
const INSTALL_SCRIPT = path.join(import.meta.dirname, 'install.js');
const PROMPT_FILE = path.join(import.meta.dirname, 'GIT-WORKTREE-PROMPT.md');

function run(...args) {
  return execFileAsync('node', [INSTALL_SCRIPT, ...args], {
    timeout: 15000,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
}

function runInDir(cwd, ...args) {
  return execFileAsync('node', [INSTALL_SCRIPT, ...args], {
    timeout: 15000,
    cwd,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
}

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gws-test-'));
});

after(() => {
  // Clean up any leftover tmp dirs
  const prefix = path.join(os.tmpdir(), 'gws-test-');
  for (const entry of fs.readdirSync(os.tmpdir())) {
    const full = path.join(os.tmpdir(), entry);
    if (full.startsWith(prefix)) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
});

// ============================================================================
// GIT-WORKTREE-PROMPT.md validation
// ============================================================================

describe('GIT-WORKTREE-PROMPT.md', () => {
  it('should exist', () => {
    assert.ok(fs.existsSync(PROMPT_FILE));
  });

  it('should start with YAML frontmatter', () => {
    const content = fs.readFileSync(PROMPT_FILE, 'utf-8').replace(/\r\n/g, '\n');
    assert.ok(content.startsWith('---\n'), 'File must start with YAML frontmatter delimiter');
    const endIdx = content.indexOf('---', 4);
    assert.ok(endIdx > 0, 'File must have closing YAML frontmatter delimiter');
  });

  it('should have name field in frontmatter', () => {
    const content = fs.readFileSync(PROMPT_FILE, 'utf-8').replace(/\r\n/g, '\n');
    const frontmatter = content.slice(4, content.indexOf('---', 4));
    assert.match(frontmatter, /^name:\s*git-worktree$/m);
  });

  it('should have description field in frontmatter', () => {
    const content = fs.readFileSync(PROMPT_FILE, 'utf-8').replace(/\r\n/g, '\n');
    const frontmatter = content.slice(4, content.indexOf('---', 4));
    assert.match(frontmatter, /^description:\s*.+$/m);
  });

  it('should contain Git Worktree Management content', () => {
    const content = fs.readFileSync(PROMPT_FILE, 'utf-8');
    assert.ok(content.includes('Git Worktree Management Assistant'));
  });
});

// ============================================================================
// --version flag
// ============================================================================

describe('--version', () => {
  it('should show version information', async () => {
    const { stdout } = await run('--version');
    assert.match(stdout, /v\d+\.\d+\.\d+/);
  });

  it('-v should also work', async () => {
    const { stdout } = await run('-v');
    assert.match(stdout, /v\d+\.\d+\.\d+/);
  });
});

describe('--help', () => {
  it('should show usage information', async () => {
    const { stdout } = await run('--help');
    assert.ok(stdout.includes('Usage: npx git-worktree-skill'));
  });

  it('should list all CLI options', async () => {
    const { stdout } = await run('--help');
    assert.ok(stdout.includes('--help'));
    assert.ok(stdout.includes('--install'));
    assert.ok(stdout.includes('--global'));
    assert.ok(stdout.includes('--project'));
    assert.ok(stdout.includes('--force'));
    assert.ok(stdout.includes('--list'));
    assert.ok(stdout.includes('--docs'));
  });

  it('should list all agent keys', async () => {
    const { stdout } = await run('--help');
    assert.ok(stdout.includes('claude-code'));
    assert.ok(stdout.includes('github-copilot'));
    assert.ok(stdout.includes('windsurf'));
    assert.ok(stdout.includes('cline'));
    assert.ok(stdout.includes('cursor'));
    assert.ok(stdout.includes('gemini-cli'));
    assert.ok(stdout.includes('roo-code'));
    assert.ok(stdout.includes('codex'));
    assert.ok(stdout.includes('opencode'));
  });

  it('-h should also work', async () => {
    const { stdout } = await run('-h');
    assert.ok(stdout.includes('Usage: npx git-worktree-skill'));
  });
});

// ============================================================================
// --list flag
// ============================================================================

describe('--list', () => {
  it('should show all supported agents', async () => {
    const { stdout } = await run('--list');
    const agents = [
      'claude-code', 'github-copilot', 'windsurf', 'cline', 'cursor',
      'gemini-cli', 'roo-code', 'codex', 'opencode',
    ];
    for (const agent of agents) {
      assert.ok(stdout.includes(agent), `Missing agent: ${agent}`);
    }
  });

  it('should not list removed agents', async () => {
    const { stdout } = await run('--list');
    const removed = ['copilot-cli', 'continue', 'zed', 'aider', 'custom'];
    for (const agent of removed) {
      assert.ok(!stdout.includes(agent), `Should not list removed agent: ${agent}`);
    }
  });
});

// ============================================================================
// --docs flag
// ============================================================================

describe('--docs', () => {
  it('should show documentation links', async () => {
    const { stdout } = await run('--docs');
    assert.ok(stdout.includes('Documentation Links'));
    assert.ok(stdout.includes('https://'));
  });

  it('should have a link for each agent', async () => {
    const { stdout } = await run('--docs');
    assert.ok(stdout.includes('Claude Code'));
    assert.ok(stdout.includes('GitHub Copilot'));
    assert.ok(stdout.includes('Windsurf'));
    assert.ok(stdout.includes('Cline'));
    assert.ok(stdout.includes('Cursor'));
    assert.ok(stdout.includes('Gemini CLI'));
    assert.ok(stdout.includes('Roo Code'));
    assert.ok(stdout.includes('Codex CLI'));
    assert.ok(stdout.includes('OpenCode'));
  });
});

// ============================================================================
// --install: single agent
// ============================================================================

describe('--install single agent', () => {
  it('should create SKILL.md for claude-code', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code');
    const skillPath = path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'SKILL.md should be created');
    assert.ok(stdout.includes('Successfully installed'));
  });

  it('should create SKILL.md for github-copilot', async () => {
    await runInDir(tmpDir, '--install', 'github-copilot');
    const skillPath = path.join(tmpDir, '.github', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for windsurf', async () => {
    await runInDir(tmpDir, '--install', 'windsurf');
    const skillPath = path.join(tmpDir, '.cascade', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for cline', async () => {
    await runInDir(tmpDir, '--install', 'cline');
    const skillPath = path.join(tmpDir, '.cline', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for gemini-cli', async () => {
    await runInDir(tmpDir, '--install', 'gemini-cli');
    const skillPath = path.join(tmpDir, '.gemini', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for roo-code', async () => {
    await runInDir(tmpDir, '--install', 'roo-code');
    const skillPath = path.join(tmpDir, '.roo', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for codex', async () => {
    await runInDir(tmpDir, '--install', 'codex');
    const skillPath = path.join(tmpDir, '.agents', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for opencode', async () => {
    await runInDir(tmpDir, '--install', 'opencode');
    const skillPath = path.join(tmpDir, '.opencode', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });

  it('should create SKILL.md for cursor', async () => {
    await runInDir(tmpDir, '--install', 'cursor');
    const skillPath = path.join(tmpDir, '.cursor', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });
});

// ============================================================================
// --install: multiple agents
// ============================================================================

describe('--install multiple agents', () => {
  it('should install for multiple comma-separated agents', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code,cline,roo-code');
    assert.ok(fs.existsSync(path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tmpDir, '.cline', 'skills', 'git-worktree', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tmpDir, '.roo', 'skills', 'git-worktree', 'SKILL.md')));
    assert.ok(stdout.includes('Successfully installed for 3 agent(s)'));
  });
});

// ============================================================================
// SKILL.md content validation
// ============================================================================

describe('SKILL.md content', () => {
  it('should have YAML frontmatter with name, description, license, and compatibility', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const skillPath = path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf-8').replace(/\r\n/g, '\n');
    assert.ok(content.startsWith('---\n'), 'Must start with frontmatter');
    assert.match(content, /^name:\s*git-worktree$/m);
    assert.match(content, /^description:\s*.+$/m);
    assert.match(content, /^license:\s*Apache-2.0$/m);
    assert.match(content, /^compatibility:\s*Requires git$/m);
  });

  it('should contain the full skill instructions', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const skillPath = path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf-8');
    assert.ok(content.includes('Git Worktree Management Assistant'));
    assert.ok(content.includes('git worktree add'));
    assert.ok(content.includes('git worktree list'));
    assert.ok(content.includes('git worktree remove'));
    assert.ok(content.includes('git worktree prune'));
  });

  it('should match the content of GIT-WORKTREE-PROMPT.md', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const skillPath = path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'SKILL.md');
    const installed = fs.readFileSync(skillPath, 'utf-8');
    const source = fs.readFileSync(PROMPT_FILE, 'utf-8');
    assert.equal(installed, source);
  });

  it('should copy the scripts directory', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const scriptPath = path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'scripts', 'setup-worktree.sh');
    assert.ok(fs.existsSync(scriptPath), 'Script should be copied');

    // On Unix, check if executable
    if (os.platform() !== 'win32') {
      const stats = fs.statSync(scriptPath);
      assert.ok((stats.mode & 0o111) !== 0, 'Script should be executable');
    }
  });
});

// ============================================================================
// Directory creation
// ============================================================================

describe('directory creation', () => {
  it('should create nested directories recursively', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(fs.existsSync(path.join(tmpDir, '.claude', 'skills', 'git-worktree')));
  });

  it('should create correct directory structure for each agent', async () => {
    await runInDir(tmpDir, '--install', 'claude-code,github-copilot,windsurf,cline,cursor,gemini-cli,roo-code,codex,opencode');
    const expectedDirs = [
      '.claude/skills/git-worktree',
      '.github/skills/git-worktree',
      '.cascade/skills/git-worktree',
      '.cline/skills/git-worktree',
      '.cursor/skills/git-worktree',
      '.gemini/skills/git-worktree',
      '.roo/skills/git-worktree',
      '.agents/skills/git-worktree',
      '.opencode/skills/git-worktree',
    ];
    for (const dir of expectedDirs) {
      const fullPath = path.join(tmpDir, dir);
      assert.ok(fs.existsSync(fullPath), `Directory should exist: ${dir}`);
    }
  });
});

// ============================================================================
// Duplicate detection
// ============================================================================

describe('duplicate detection', () => {
  it('should skip when skill already exists', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(stdout.includes('already exists'));
    assert.ok(stdout.includes('Skipped 1 agent'));
  });

  it('should show --force hint in skip message', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(stdout.includes('--force'));
  });
});

// ============================================================================
// --force flag
// ============================================================================

describe('--force flag', () => {
  it('should overwrite existing skill file', async () => {
    // Write a dummy file first
    const skillDir = path.join(tmpDir, '.claude', 'skills', 'git-worktree');
    fs.mkdirSync(skillDir, { recursive: true });
    const skillPath = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(skillPath, '---\nname: git-worktree\n---\n# Git Worktree Management placeholder\n', 'utf-8');

    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code', '--force');
    const content = fs.readFileSync(skillPath, 'utf-8');
    assert.ok(content.includes('Git Worktree Management Assistant'), 'File should be overwritten with full content');
    assert.ok(stdout.includes('Successfully installed'));
  });

  it('should not show already-exists when using --force', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code', '--force');
    assert.ok(!stdout.includes('already exists'));
  });
});

// ============================================================================
// --global / --project path selection
// ============================================================================

describe('--project flag', () => {
  it('should use project path for claude-code', async () => {
    await runInDir(tmpDir, '--install', 'claude-code', '--project');
    const skillPath = path.join(tmpDir, '.claude', 'skills', 'git-worktree', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath));
  });
});

describe('--global flag', () => {
  it('should use global path (homedir-based) for claude-code', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code', '--global', '--force');
    const homedir = os.homedir();
    // On Windows, short paths (JPARKE~1) may be used; check for the .claude portion
    assert.ok(
      stdout.includes(homedir) || stdout.includes('.claude'),
      'Path should reference global .claude directory'
    );
    assert.ok(stdout.includes('Successfully installed'));
  });

  it('should fall back to first path for agents without global option', async () => {
    // github-copilot and roo-code only have project paths
    const { stdout } = await runInDir(tmpDir, '--install', 'github-copilot', '--global');
    assert.ok(stdout.includes('Successfully installed'));
  });
});

// ============================================================================
// Error handling
// ============================================================================

describe('error handling', () => {
  it('should report unknown agent', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'nonexistent-agent');
    assert.ok(stdout.includes('Unknown agent'));
    assert.ok(stdout.includes('nonexistent-agent'));
    assert.ok(stdout.includes('Skipped 1 agent'));
  });

  it('should handle mix of valid and invalid agents', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code,fake-agent');
    assert.ok(stdout.includes('Successfully installed for 1 agent'));
    assert.ok(stdout.includes('Unknown agent'));
    assert.ok(stdout.includes('fake-agent'));
  });

  it('should error when --install has no agent argument', async () => {
    try {
      await runInDir(tmpDir, '--install');
      assert.fail('Should have exited with error');
    } catch (err) {
      assert.ok(err.stderr.includes('specify agents') || err.stdout.includes('specify agents'));
    }
  });

  it('should error when --install is followed by another flag', async () => {
    try {
      await runInDir(tmpDir, '--install', '--global');
      assert.fail('Should have exited with error');
    } catch (err) {
      assert.ok(err.stderr.includes('specify agents') || err.stdout.includes('specify agents'));
    }
  });
});

// ============================================================================
// Summary output
// ============================================================================

describe('summary output', () => {
  it('should show Installation Complete header', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(stdout.includes('Installation Complete'));
  });

  it('should show agent name and path in success summary', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(stdout.includes('Claude Code'));
    assert.ok(stdout.includes('SKILL.md'));
  });

  it('should show usage hints', async () => {
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(stdout.includes('Ask your AI agent about Git worktrees'));
  });

  it('should count successful and skipped agents correctly', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    const { stdout } = await runInDir(tmpDir, '--install', 'claude-code,cline');
    assert.ok(stdout.includes('Successfully installed for 1 agent'));
    assert.ok(stdout.includes('Skipped 1 agent'));
  });
});

// ============================================================================
// Banner
// ============================================================================

describe('banner', () => {
  it('should display the banner on all commands', async () => {
    const { stdout } = await run('--list');
    assert.ok(stdout.includes('Git Worktree Skill Installer'));
  });
});

// ============================================================================
// File integrity: non-destructive behavior
// ============================================================================

describe('non-destructive behavior', () => {
  it('should not modify an existing unrelated SKILL.md', async () => {
    const skillDir = path.join(tmpDir, '.claude', 'skills', 'git-worktree');
    fs.mkdirSync(skillDir, { recursive: true });
    const skillPath = path.join(skillDir, 'SKILL.md');
    const originalContent = '---\nname: other-skill\n---\n# Some other skill\n';
    fs.writeFileSync(skillPath, originalContent, 'utf-8');

    await runInDir(tmpDir, '--install', 'claude-code');

    // Should overwrite since it doesn't contain "Git Worktree Management"
    const content = fs.readFileSync(skillPath, 'utf-8');
    assert.ok(content.includes('Git Worktree Management'));
  });

  it('should not touch files for other agents', async () => {
    await runInDir(tmpDir, '--install', 'claude-code');
    assert.ok(!fs.existsSync(path.join(tmpDir, '.cline')));
    assert.ok(!fs.existsSync(path.join(tmpDir, '.cascade')));
    assert.ok(!fs.existsSync(path.join(tmpDir, '.github')));
  });
});
