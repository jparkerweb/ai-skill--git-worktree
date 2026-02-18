#!/bin/bash

# ==============================================================================
# Git Worktree Setup Script
# Automates environment setup for a new worktree.
# ==============================================================================

MAIN_REPO=$1

# Try to detect main repo if not provided
if [ -z "$MAIN_REPO" ]; then
    # Look for a sibling directory that doesn't have a worktree suffix
    # or just assume it's one level up if we can't be sure.
    CURRENT_DIR=$(basename "$(pwd)")
    PARENT_DIR=".."

    # Common pattern: project-name (main) and project-name-feature (worktree)
    # Strip everything after the last hyphen to try and find the base name
    BASE_NAME=$(echo "$CURRENT_DIR" | sed 's/-[^-]*$//')

    if [ -d "../$BASE_NAME" ] && [ "../$BASE_NAME" != "." ]; then
        MAIN_REPO="../$BASE_NAME"
    else
        MAIN_REPO=".."
    fi
fi

echo "--------------------------------------------------------"
echo "🛠️  Setting up worktree environment..."
echo "📂 Main repository: $MAIN_REPO"
echo "--------------------------------------------------------"

# 1. Install Dependencies (check lock files first to detect the correct package manager)
if [ -f "pnpm-lock.yaml" ]; then
    echo "📦 Node.js (pnpm) project detected. Installing dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        echo "⚠️  pnpm not found. Please install dependencies manually."
    fi
elif [ -f "yarn.lock" ]; then
    echo "📦 Node.js (yarn) project detected. Installing dependencies..."
    if command -v yarn &> /dev/null; then
        yarn install
    else
        echo "⚠️  yarn not found. Please install dependencies manually."
    fi
elif [ -f "package.json" ]; then
    echo "📦 Node.js project detected. Installing dependencies..."
    if command -v npm &> /dev/null; then
        npm install
    else
        echo "⚠️  npm not found. Please install dependencies manually."
    fi
elif [ -f "requirements.txt" ]; then
    echo "🐍 Python project detected. Installing dependencies..."
    if command -v pip &> /dev/null; then
        pip install -r requirements.txt
    else
        echo "⚠️  pip not found. Please install dependencies manually."
    fi
fi

# 2. Copy Environment Files
ENV_FILES=(".env" ".env.local" ".env.development" "config.local.json" "dev.config.json")
COPIED_COUNT=0

for f in "${ENV_FILES[@]}"; do
    if [ -f "$MAIN_REPO/$f" ]; then
        if [ ! -f "$f" ]; then
            echo "📄 Copying $f from main repo..."
            cp "$MAIN_REPO/$f" ./
            COPIED_COUNT=$((COPIED_COUNT + 1))
        else
            echo "⏭️  $f already exists, skipping."
        fi
    fi
done

if [ $COPIED_COUNT -eq 0 ]; then
    echo "ℹ️  No environment files found to copy."
fi

echo "--------------------------------------------------------"
echo "✅ Worktree setup complete!"
echo "🚀 You are ready to develop in $(pwd)"
echo "--------------------------------------------------------"
