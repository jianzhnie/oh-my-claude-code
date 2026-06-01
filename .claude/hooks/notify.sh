#!/bin/bash
# Notification hook: WeChat + desktop + voice when Claude needs attention
set -euo pipefail

INPUT=$(cat)
NOTIFY_TYPE=$(jq -r '.notification_type // "task"' <<<"$INPUT")
MESSAGE=$(jq -r '.message // ""' <<<"$INPUT")

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
PROJECT=$(basename "$PROJECT_DIR")
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "N/A")

case "$NOTIFY_TYPE" in
    permission) VOICE_TEXT="需要授权" ;;
    *)          VOICE_TEXT="任务完成，请确认" ;;
esac

# WeChat notification via Server酱
if [[ -f "$PROJECT_DIR/.claude/.env" ]]; then
    SCT_SENDKEY=$(grep '^SCT_SENDKEY=' "$PROJECT_DIR/.claude/.env" | cut -d= -f2-)
    if [[ -n "${SCT_SENDKEY:-}" ]]; then
        UNCOMMITTED=$(git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')

        # Single git diff call, single while-read pass computes both adds + dels
        DIFF_STATS=$(git -C "$PROJECT_DIR" diff --numstat 2>/dev/null || true)
        TOTAL_ADDS=0
        TOTAL_DELS=0
        while IFS=$'\t' read -r adds dels _; do
            TOTAL_ADDS=$((TOTAL_ADDS + adds))
            TOTAL_DELS=$((TOTAL_DELS + dels))
        done <<< "$DIFF_STATS"

        STATS="📝 ${UNCOMMITTED}未提交"
        [[ "$TOTAL_ADDS" -gt 0 || "$TOTAL_DELS" -gt 0 ]] && STATS="📈 +${TOTAL_ADDS} −${TOTAL_DELS}  ${STATS}"

        TITLE="[Claude] ${VOICE_TEXT}"
        DESP="## ${PROJECT} · ${BRANCH}

> ${MESSAGE:-Claude 需要你的关注}

${STATS}"

        nohup curl -s -X POST "https://sctapi.ftqq.com/${SCT_SENDKEY}.send" \
            -d "title=${TITLE}" \
            -d "desp=${DESP}" \
            -o /dev/null &>/dev/null &
        disown
    fi
fi

# Desktop notification (macOS)
osascript -e "display notification \"${MESSAGE:-Claude 需要你的关注}\" with title \"Claude Code\"" 2>/dev/null || true

# Voice notification (macOS) — detached, survives hook exit
nohup say "$VOICE_TEXT" &>/dev/null &
