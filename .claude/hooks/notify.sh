#!/bin/bash
# Notification hook: WeChat + desktop + voice when Claude needs attention
set -euo pipefail

INPUT=$(cat)
NOTIFY_TYPE=$(jq -r '.notification_type // "task"' <<<"$INPUT")
MESSAGE=$(jq -r '.message // ""' <<<"$INPUT")

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
PROJECT=$(basename "$PROJECT_DIR")
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "N/A")

# Build a short spoken summary
case "$NOTIFY_TYPE" in
    permission)
        VOICE_TEXT="需要授权"
        ;;
    *)
        VOICE_TEXT="任务完成，请确认"
        ;;
esac

# WeChat notification via Server酱 (fire-and-forget in background)
if [[ -f "$PROJECT_DIR/.claude/.env" ]]; then
    SCT_SENDKEY=$(grep '^SCT_SENDKEY=' "$PROJECT_DIR/.claude/.env" | cut -d= -f2-)
    if [[ -n "${SCT_SENDKEY:-}" ]]; then
        UNCOMMITTED=$(git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        DIFF_STAT=$(git -C "$PROJECT_DIR" diff --stat --color=never 2>/dev/null | tail -1 || echo "")
        GIT_SUMMARY=""
        [[ -n "$DIFF_STAT" ]] && GIT_SUMMARY="变更: ${DIFF_STAT}\n"

        TITLE="[Claude] ${VOICE_TEXT}"
        DESP="${MESSAGE:-Claude 需要你的关注}\n\n**项目**: ${PROJECT} · **分支**: ${BRANCH}\n${GIT_SUMMARY}**未提交**: ${UNCOMMITTED} 个文件"

        nohup curl -s -X POST "https://sctapi.ftqq.com/${SCT_SENDKEY}.send" \
            -d "title=${TITLE}" \
            -d "desp=${DESP}" \
            -o /dev/null &>/dev/null &
        disown
    fi
fi

# Desktop notification (macOS) — synchronous, near-instant (~100ms)
osascript -e "display notification \"${MESSAGE:-Claude 需要你的关注}\" with title \"Claude Code\"" 2>/dev/null || true

# Voice notification (macOS) — detached, survives hook exit
nohup say "$VOICE_TEXT" &>/dev/null &
