#!/bin/bash
# SessionStart compact hook: re-inject critical context after compaction
set -euo pipefail

PROJECT_DIR="$CLAUDE_PROJECT_DIR"

echo "## Post-compaction restore — $(basename "$PROJECT_DIR")"
echo ""

# State snapshot
echo "### State"
echo "- Branch: $(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo 'N/A')"
UNCOMMITTED=$(git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "- Uncommitted: ${UNCOMMITTED} files"
echo ""

# Recent commits for orientation
echo "### Recent commits"
git -C "$PROJECT_DIR" log --oneline -5 2>/dev/null || echo "(no git history)"
echo ""

# Point to canonical docs rather than duplicating
echo "### Reference"
echo "- CLAUDE.md, .claude/rules/, .claude/agents/ for full conventions"
echo "- Hook list: SessionStart → SessionEnd + PreToolUse + PostToolUse(Edit|Write→format+shellcheck) + Notification + SubagentStart"
