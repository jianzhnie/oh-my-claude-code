#!/bin/bash
# PreToolUse hook: block dangerous commands and protect sensitive files
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(jq -r '.tool_name' <<<"$INPUT")

deny() {
    jq -n --arg reason "$1" \
        '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
    exit 0
}

# ---- Bash command checks ----
if [[ "$TOOL_NAME" == "Bash" ]]; then
    COMMAND=$(jq -r '.tool_input.command' <<<"$INPUT")

    # Block rm -rf on system-critical or home directories (single grep)
    if echo "$COMMAND" | grep -qE 'rm\s+-[a-zA-Z]*[rf][a-zA-Z]*\s+(/($|\s|home|etc|usr|var|opt)|\$HOME|~)'; then
        deny "Blocked: rm -rf on system/HOME directory is prohibited by safety policy"
    fi

    # Block writing to .env files via shell redirection
    if echo "$COMMAND" | grep -qE '>\s*(\.\s*)?\.env'; then
        deny "Blocked: writing to .env may leak secrets — use a different approach for credentials"
    fi

    # Block force push and direct push to main/master (single grep)
    if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f\b|--force\b|--force-with-lease\b|\b(main|master)\b)'; then
        deny "Blocked: force push or direct push to main/master — use a PR instead"
    fi
fi

# ---- Write/Edit file path checks ----
if [[ "$TOOL_NAME" == "Write" || "$TOOL_NAME" == "Edit" ]]; then
    FILE_PATH=$(jq -r '.tool_input.file_path // empty' <<<"$INPUT")

    # Block .env files
    if [[ "$FILE_PATH" == */.env || "$FILE_PATH" == */.env.* ]]; then
        deny "Blocked: ${FILE_PATH} — .env files may contain sensitive data"
    fi

    # Block protected file patterns (bash built-in, no grep fork)
    for pattern in "package-lock.json" ".git/"; do
        if [[ "$FILE_PATH" == *"$pattern"* ]]; then
            deny "Blocked: ${FILE_PATH} matches protected pattern ${pattern}"
        fi
    done
fi

exit 0
