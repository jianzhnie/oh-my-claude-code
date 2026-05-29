#!/bin/bash
# Status line: context usage + git branch/changes + model
set -euo pipefail

input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name // "?"')
PCT_RAW=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
PCT=${PCT_RAW%%.*}

# Context bar (10 chars)
BAR_WIDTH=10
FILLED=$((PCT * BAR_WIDTH / 100))
printf -v bar_fill "%${FILLED}s"
printf -v bar_pad "%$((BAR_WIDTH - FILLED))s"
BAR="${bar_fill// /▓}${bar_pad// /░}"

# Color: green <50%, yellow <80%, red >=80%
if [ "$PCT" -ge 80 ]; then
    COLOR='\033[31m'
elif [ "$PCT" -ge 50 ]; then
    COLOR='\033[33m'
else
    COLOR='\033[32m'
fi
RESET='\033[0m'

# Pure-bash human-readable token count (no bc/awk dependency)
human_tokens() {
    local n="$1"
    if (( n >= 1000000 )); then
        printf "%d.%dM" "$(( (n + 50000) / 1000000 ))" "$(( ((n + 50000) % 1000000) / 100000 ))"
    elif (( n >= 1000 )); then
        printf "%d.%dK" "$(( (n + 50) / 1000 ))" "$(( ((n + 50) % 1000) / 100 ))"
    else
        printf "%d" "$n"
    fi
}

USED=$(echo "$input" | jq -r '.context_window.used_tokens // 0')
TOTAL=$(echo "$input" | jq -r '.context_window.total_tokens // 1000000')
# Fallback: if token fields aren't in the JSON, estimate from percentage
if [ "$USED" = "0" ] || [ "$USED" = "null" ]; then
    USED=$((PCT * TOTAL / 100))
fi

printf "%b%s %s %s/%s %3d%%%b" "$COLOR" "$BAR" "$MODEL" \
    "$(human_tokens "$USED")" "$(human_tokens "$TOTAL")" "$PCT" "$RESET"

# Git info
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
    STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
    MODIFIED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
    UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')

    printf "  \033[36m%s\033[0m" "$BRANCH"
    if [ "$STAGED" -gt 0 ] || [ "$MODIFIED" -gt 0 ] || [ "$UNTRACKED" -gt 0 ]; then
        printf " |"
        [ "$STAGED" -gt 0 ] && printf " \033[32m+%d\033[0m" "$STAGED"
        [ "$MODIFIED" -gt 0 ] && printf " \033[33mM%d\033[0m" "$MODIFIED"
        [ "$UNTRACKED" -gt 0 ] && printf " \033[90m?%d\033[0m" "$UNTRACKED"
    fi
fi
true
