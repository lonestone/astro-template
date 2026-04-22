#!/bin/bash
ln -sf CLAUDE.md AGENTS.md
mkdir -p .cursor
ln -sf ../.claude/skills .cursor/skills
echo "✓ Cursor compat setup done"
