#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION: Supported AI Agents
// ============================================================================

const AI_AGENTS = {
  'claude-code': {
    name: 'Claude Code',
    description: 'Anthropic\'s CLI coding assistant',
    paths: [
      { type: 'project', path: '.claude/skills/git-worktree/SKILL.md', description: 'Project skill' },
      { type: 'global', path: path.join(os.homedir(), '.claude', 'skills', 'git-worktree', 'SKILL.md'), description: 'Global skill' },
    ],
    defaultChoice: 0,
    docs: 'https://code.claude.com/docs/en/skills'
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    description: 'GitHub\'s AI pair programmer',
    paths: [
      { type: 'project', path: '.github/skills/git-worktree/SKILL.md', description: 'Project skill' },
    ],
    defaultChoice: 0,
    docs: 'https://docs.github.com/en/copilot'
  },
  'windsurf': {
    name: 'Windsurf',
    description: 'Codeium\'s agentic IDE',
    paths: [
      { type: 'project', path: '.cascade/skills/git-worktree/SKILL.md', description: 'Project skill' },
      { type: 'global', path: path.join(os.homedir(), '.cascade', 'skills', 'git-worktree', 'SKILL.md'), description: 'Global skill' },
    ],
    defaultChoice: 0,
    docs: 'https://docs.windsurf.com/windsurf/cascade/skills'
  },
  'cline': {
    name: 'Cline',
    description: 'Autonomous AI coding agent for VS Code',
    paths: [
      { type: 'project', path: '.cline/skills/git-worktree/SKILL.md', description: 'Project skill' },
      { type: 'global', path: path.join(os.homedir(), '.cline', 'skills', 'git-worktree', 'SKILL.md'), description: 'Global skill' },
    ],
    defaultChoice: 0,
    docs: 'https://docs.cline.bot/features/skills'
  },
  'gemini-cli': {
    name: 'Gemini CLI',
    description: 'Google\'s AI in the terminal',
    paths: [
      { type: 'project', path: '.gemini/skills/git-worktree/SKILL.md', description: 'Project skill' },
      { type: 'global', path: path.join(os.homedir(), '.gemini', 'skills', 'git-worktree', 'SKILL.md'), description: 'Global skill' },
    ],
    defaultChoice: 0,
    docs: 'https://geminicli.com/docs/cli/skills/'
  },
  'roo-code': {
    name: 'Roo Code',
    description: 'AI coding assistant (Cline fork)',
    paths: [
      { type: 'project', path: '.roo/skills/git-worktree/SKILL.md', description: 'Project skill' },
    ],
    defaultChoice: 0,
    docs: 'https://docs.roocode.com/features/skills'
  },
  'codex': {
    name: 'Codex CLI',
    description: 'OpenAI\'s coding assistant CLI',
    paths: [
      { type: 'project', path: '.agents/skills/git-worktree/SKILL.md', description: 'Project skill' },
      { type: 'global', path: path.join(os.homedir(), '.codex', 'skills', 'git-worktree', 'SKILL.md'), description: 'Global skill' },
    ],
    defaultChoice: 0,
    docs: 'https://github.com/openai/codex'
  },
  'opencode': {
    name: 'OpenCode',
    description: 'Terminal-based AI coding assistant',
    paths: [
      { type: 'project', path: '.opencode/skills/git-worktree/SKILL.md', description: 'Project skill' },
      { type: 'global', path: path.join(os.homedir(), '.config', 'opencode', 'skills', 'git-worktree', 'SKILL.md'), description: 'Global skill' },
    ],
    defaultChoice: 0,
    docs: 'https://github.com/opencode-ai/opencode'
  },
};

// ============================================================================
// SKILL CONTENT
// ============================================================================

function getSkillContent() {
  const promptPath = path.join(__dirname, 'GIT-WORKTREE-PROMPT.md');
  if (fs.existsSync(promptPath)) {
    return fs.readFileSync(promptPath, 'utf-8');
  }
  // Fallback: embedded minimal version
  return `---
name: git-worktree
description: Git Worktree Management Assistant - guides users in creating, managing, and removing Git worktrees for parallel development workflows
---

# Git Worktree Management Assistant

You are a Git Worktree Management Assistant. Help users create, manage, and remove Git worktrees.

## Quick Commands

\`\`\`bash
# Create worktree for new branch
git worktree add ../project-feature -b feature/name origin/main

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../project-feature

# Clean stale references
git worktree prune
\`\`\`

Guide users interactively through worktree operations.
`;
}

// ============================================================================
// UI HELPERS
// ============================================================================

function printBanner() {
  console.log('');
  console.log(chalk.cyan.bold('╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║') + chalk.white.bold('       Git Worktree Skill Installer                           ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('║') + chalk.gray('       Install worktree management for any AI agent           ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('╚══════════════════════════════════════════════════════════════╝'));
  console.log('');
}

function printSuccess(message) {
  console.log(chalk.green('✓ ') + message);
}

function printError(message) {
  console.log(chalk.red('✗ ') + message);
}

function printInfo(message) {
  console.log(chalk.blue('ℹ ') + message);
}

function printWarning(message) {
  console.log(chalk.yellow('⚠ ') + message);
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function writeSkillFile(filePath, content, force = false) {
  ensureDirectoryExists(filePath);

  if (!force && fileExists(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    if (existing.includes('Git Worktree Management')) {
      return { success: false, reason: 'already-exists' };
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  return { success: true };
}

// ============================================================================
// MAIN INSTALLER FLOW
// ============================================================================

async function selectAgents() {
  const agentChoices = Object.entries(AI_AGENTS).map(([key, agent]) => ({
    name: `${agent.name} ${chalk.gray(`- ${agent.description}`)}`,
    value: key,
    short: agent.name
  }));

  agentChoices.push(new inquirer.Separator());
  agentChoices.push({
    name: chalk.red('Exit'),
    value: '_exit',
    short: 'Exit'
  });

  const { selectedAgents } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedAgents',
      message: 'Select AI agents to install the skill for:\n',
      choices: agentChoices,
      pageSize: 16,
      validate: (answer) => {
        if (answer.includes('_exit')) {
          return true;
        }
        if (answer.length < 1) {
          return 'You must select at least one agent.';
        }
        return true;
      }
    }
  ]);

  if (selectedAgents.includes('_exit')) {
    printInfo('Installation cancelled.');
    process.exit(0);
  }

  return selectedAgents;
}

async function selectPathForAgent(agentKey) {
  const agent = AI_AGENTS[agentKey];

  if (agent.paths.length === 1) {
    return agent.paths[0];
  }

  const pathChoices = agent.paths.map((p, idx) => ({
    name: `${p.path} ${chalk.gray(`(${p.description})`)}`,
    value: idx,
    short: p.path
  }));

  const { selectedPath } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPath',
      message: `Select installation path for ${chalk.cyan(agent.name)}:`,
      choices: pathChoices,
      default: agent.defaultChoice
    }
  ]);

  return agent.paths[selectedPath];
}

async function confirmInstallation(installations) {
  console.log('');
  console.log(chalk.white.bold('Installation Summary:'));
  console.log(chalk.gray('─'.repeat(60)));

  installations.forEach(({ agent, pathInfo }) => {
    const agentConfig = AI_AGENTS[agent];
    const typeLabel = pathInfo.type === 'global' ? chalk.yellow('[GLOBAL]') : chalk.blue('[PROJECT]');
    console.log(`  ${typeLabel} ${chalk.cyan(agentConfig.name)}`);
    console.log(`    → ${chalk.gray(pathInfo.path)}`);
  });

  console.log(chalk.gray('─'.repeat(60)));
  console.log('');

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed with installation?',
      default: true
    }
  ]);

  return confirmed;
}

async function handleExistingFile(filePath, agentName) {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `SKILL.md exists at ${chalk.yellow(filePath)}. What would you like to do?`,
      choices: [
        { name: 'Overwrite file', value: 'overwrite' },
        { name: 'Skip this agent', value: 'skip' },
        { name: 'Choose different path', value: 'different' }
      ]
    }
  ]);

  return action;
}

async function performInstallation(installations) {
  const skillContent = getSkillContent();
  const results = [];

  for (const { agent, pathInfo } of installations) {
    const agentConfig = AI_AGENTS[agent];
    let finalPath = pathInfo.path;

    // Resolve relative paths to current directory
    if (!path.isAbsolute(finalPath)) {
      finalPath = path.resolve(process.cwd(), finalPath);
    }

    console.log('');
    printInfo(`Installing for ${chalk.cyan(agentConfig.name)}...`);

    // Check if file exists
    if (fileExists(finalPath)) {
      const action = await handleExistingFile(finalPath, agentConfig.name);

      if (action === 'skip') {
        printWarning(`Skipped ${agentConfig.name}`);
        results.push({ agent, success: false, reason: 'skipped' });
        continue;
      }

      if (action === 'different') {
        const newPathInfo = await selectPathForAgent(agent);
        finalPath = path.isAbsolute(newPathInfo.path)
          ? newPathInfo.path
          : path.resolve(process.cwd(), newPathInfo.path);
      }
    }

    const result = writeSkillFile(finalPath, skillContent);
    if (!result.success && result.reason === 'already-exists') {
      printWarning(`Skill already exists in ${finalPath}`);
      results.push({ agent, success: false, reason: 'already-exists' });
      continue;
    }

    printSuccess(`Installed to ${chalk.gray(finalPath)}`);
    results.push({ agent, success: true, path: finalPath });
  }

  return results;
}

function printFinalSummary(results) {
  console.log('');
  console.log(chalk.white.bold('Installation Complete!'));
  console.log(chalk.gray('═'.repeat(60)));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  if (successful.length > 0) {
    console.log('');
    console.log(chalk.green.bold(`✓ Successfully installed for ${successful.length} agent(s):`));
    successful.forEach(r => {
      const agent = AI_AGENTS[r.agent];
      console.log(`  • ${agent.name}: ${chalk.gray(r.path)}`);
    });
  }

  if (failed.length > 0) {
    console.log('');
    console.log(chalk.yellow.bold(`⚠ Skipped ${failed.length} agent(s):`));
    failed.forEach(r => {
      const agent = AI_AGENTS[r.agent];
      const name = agent ? agent.name : r.agent;
      console.log(`  • ${name}: ${chalk.gray(r.reason)}`);
    });
  }

  console.log('');
  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.cyan('Usage:') + ' Ask your AI agent about Git worktrees!');
  console.log(chalk.gray('  Try: "Help me create a worktree for a new feature"'));
  console.log(chalk.gray('  Try: "List my current worktrees"'));
  console.log(chalk.gray('  Try: "How do I clean up old worktrees?"'));
  console.log('');
}

async function showDocumentation() {
  console.log('');
  console.log(chalk.white.bold('AI Agent Documentation Links:'));
  console.log(chalk.gray('─'.repeat(60)));

  Object.entries(AI_AGENTS).forEach(([key, agent]) => {
    if (agent.docs) {
      console.log(`  ${chalk.cyan(agent.name)}: ${chalk.gray(agent.docs)}`);
    }
  });
  console.log('');
}

// ============================================================================
// NON-INTERACTIVE INSTALLATION
// ============================================================================

async function nonInteractiveInstall(agents, pathType = 'default', force = false) {
  const skillContent = getSkillContent();
  const results = [];

  for (const agentKey of agents) {
    const agent = AI_AGENTS[agentKey];
    if (!agent) {
      printError(`Unknown agent: ${agentKey}`);
      results.push({ agent: agentKey, success: false, reason: 'unknown-agent' });
      continue;
    }

    // Select path based on pathType
    let pathInfo;
    if (pathType === 'global') {
      pathInfo = agent.paths.find(p => p.type === 'global') || agent.paths[0];
    } else if (pathType === 'project') {
      pathInfo = agent.paths.find(p => p.type === 'project') || agent.paths[0];
    } else {
      pathInfo = agent.paths[agent.defaultChoice] || agent.paths[0];
    }

    if (!pathInfo) {
      printError(`No paths configured for ${agent.name}`);
      results.push({ agent: agentKey, success: false, reason: 'no-paths' });
      continue;
    }

    let finalPath = pathInfo.path;
    if (!path.isAbsolute(finalPath)) {
      finalPath = path.resolve(process.cwd(), finalPath);
    }

    printInfo(`Installing for ${chalk.cyan(agent.name)}...`);

    // Check existing file (skip duplicate check if --force)
    if (!force && fileExists(finalPath)) {
      const existing = fs.readFileSync(finalPath, 'utf-8');
      if (existing.includes('Git Worktree Management')) {
        printWarning(`Skill already exists in ${finalPath} (use --force to overwrite)`);
        results.push({ agent: agentKey, success: false, reason: 'already-exists' });
        continue;
      }
    }

    writeSkillFile(finalPath, skillContent, force);
    printSuccess(`Installed to ${chalk.gray(finalPath)}`);
    results.push({ agent: agentKey, success: true, path: finalPath });
  }

  return results;
}

// ============================================================================
// ENTRY POINT
// ============================================================================

async function main() {
  try {
    printBanner();

    // Check if running with --help
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      console.log('Usage: npx git-worktree-skill [options]');
      console.log('');
      console.log('Interactive installer for Git Worktree Management skill.');
      console.log('Creates SKILL.md files following the Agent Skills standard.');
      console.log('');
      console.log('Supported agents:');
      console.log('  • Claude Code, GitHub Copilot, Windsurf, Cline');
      console.log('  • Gemini CLI, Roo Code, Codex CLI, OpenCode');
      console.log('');
      console.log('Options:');
      console.log('  --help, -h              Show this help message');
      console.log('  --docs                  Show documentation links for all agents');
      console.log('  --list                  List all supported agents');
      console.log('  --install <agents>      Non-interactive install (comma-separated)');
      console.log('  --global                Use global paths (with --install)');
      console.log('  --project               Use project paths (with --install)');
      console.log('  --force                 Overwrite existing skill files (with --install)');
      console.log('');
      console.log('Examples:');
      console.log('  npx git-worktree-skill');
      console.log('  npx git-worktree-skill --install claude-code,cline');
      console.log('  npx git-worktree-skill --install windsurf --global');
      console.log('  npx git-worktree-skill --install claude-code --force');
      console.log('');
      console.log('Agent keys: claude-code, github-copilot, windsurf, cline,');
      console.log('            gemini-cli, roo-code, codex, opencode');
      console.log('');
      process.exit(0);
    }

    // Non-interactive installation
    const installIdx = process.argv.findIndex(arg => arg === '--install');
    if (installIdx !== -1) {
      const agentsArg = process.argv[installIdx + 1];
      if (!agentsArg || agentsArg.startsWith('--')) {
        printError('Please specify agents: --install agent1,agent2');
        process.exit(1);
      }

      const agents = agentsArg.split(',').map(a => a.trim());
      const pathType = process.argv.includes('--global') ? 'global' :
                       process.argv.includes('--project') ? 'project' : 'default';
      const force = process.argv.includes('--force');

      const results = await nonInteractiveInstall(agents, pathType, force);
      printFinalSummary(results);
      process.exit(0);
    }

    if (process.argv.includes('--docs')) {
      await showDocumentation();
      process.exit(0);
    }

    if (process.argv.includes('--list')) {
      console.log(chalk.white.bold('Supported AI Agents:'));
      console.log('');
      Object.entries(AI_AGENTS).forEach(([key, agent]) => {
        console.log(`  ${chalk.cyan(key.padEnd(20))} ${agent.name} ${chalk.gray(`- ${agent.description}`)}`);
      });
      console.log('');
      process.exit(0);
    }

    // Step 1: Select agents
    const selectedAgents = await selectAgents();

    // Step 2: Select paths for each agent
    const installations = [];
    for (const agent of selectedAgents) {
      const pathInfo = await selectPathForAgent(agent);
      installations.push({ agent, pathInfo });
    }

    // Step 3: Confirm installation
    const confirmed = await confirmInstallation(installations);
    if (!confirmed) {
      printInfo('Installation cancelled.');
      process.exit(0);
    }

    // Step 4: Perform installation
    const results = await performInstallation(installations);

    // Step 5: Show summary
    printFinalSummary(results);

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      // User pressed Ctrl+C
      console.log('');
      printInfo('Installation cancelled.');
      process.exit(0);
    }
    printError(`Installation failed: ${error.message}`);
    process.exit(1);
  }
}

main();
