#!/bin/bash
# Status line: context usage + git branch/changes + model
set -euo pipefail

input=$(cat)

# Tab-delimited jq output survives spaces in model name
IFS=$'\t' read -r MODEL PCT_RAW USED TOTAL <<<"$(jq -r '[.model.display_name // "?", .context_window.used_percentage // 0, .context_window.used_tokens // 0, .context_window.total_tokens // 1000000] | join("\t")' 2>/dev/null <<<"$input")"
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
        local k=$(( (n + 50) / 1000 ))
        local r=$(( (n + 50) % 1000 / 100 ))
        if (( k >= 1000 )); then
            printf "1.0M"
        else
            printf "%d.%dK" "$k" "$r"
        fi
    else
        printf "%d" "$n"
    fi
}

# USED and TOTAL already extracted by single jq call above.
# Fallback: if token fields aren't in the JSON, estimate from percentage
if [[ -z "${USED:-}" || "$USED" = "0" || "$USED" = "null" ]]; then
    TOTAL="${TOTAL:-1000000}"
    USED=$((PCT * TOTAL / 100))
fi

printf "%b%s %s %s/%s %3d%%%b" "$COLOR" "$BAR" "$MODEL" \
    "$(human_tokens "$USED")" "$(human_tokens "$TOTAL")" "$PCT" "$RESET"

# Git info — single git status call replaces 3 separate git forks
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
    # Parse one --porcelain output for staged/modified/untracked counts
    GIT_STATUS=$(git status --porcelain 2>/dev/null || true)
    STAGED=$(grep -cE '^[MADRC]' <<< "$GIT_STATUS" 2>/dev/null || echo 0)
    MODIFIED=$(grep -cE '^.[MD]' <<< "$GIT_STATUS" 2>/dev/null || echo 0)
    UNTRACKED=$(grep -c '^??' <<< "$GIT_STATUS" 2>/dev/null || echo 0)
    # Strip non-numeric chars (grep -c may produce leading spaces)
    STAGED=${STAGED//[!0-9]/}
    MODIFIED=${MODIFIED//[!0-9]/}
    UNTRACKED=${UNTRACKED//[!0-9]/}
    STAGED=${STAGED:-0}
    MODIFIED=${MODIFIED:-0}
    UNTRACKED=${UNTRACKED:-0}

    printf "  \033[36m%s\033[0m" "$BRANCH"
    if [ "$STAGED" -gt 0 ] || [ "$MODIFIED" -gt 0 ] || [ "$UNTRACKED" -gt 0 ]; then
        printf " |"
        [ "$STAGED" -gt 0 ] && printf " \033[32m+%d\033[0m" "$STAGED"
        [ "$MODIFIED" -gt 0 ] && printf " \033[33mM%d\033[0m" "$MODIFIED"
        [ "$UNTRACKED" -gt 0 ] && printf " \033[90m?%d\033[0m" "$UNTRACKED"
    fi
fi
true
