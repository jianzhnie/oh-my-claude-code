# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

oh-my-claude-code 是一套 Claude Code 配置集合，包含自定义 Agents、Skills、Hooks、Rules 和 MCP 服务器配置。

## 目录结构

```
.claude/
├── agents/          # 9 个自定义 Agent 定义
├── skills/          # 自定义 Skill
├── hooks/           # 会话生命周期钩子
├── rules/           # 代码规范（Python、Shell、Git）
├── output-styles/   # 回复风格模板
└── settings.json    # 项目级配置
```

## 常用命令

```bash
# 安装开发依赖并配置 pre-commit
pip install -e ".[dev]"
pre-commit install

# 运行 pre-commit 检查
pre-commit run --all-files

# Lint 和格式化
ruff check .
ruff format .

# 类型检查
mypy .

# 运行测试
pytest
```

## Agent 定义

9 个自定义 Agent 位于 `.claude/agents/`：`architect`、`code-reviewer`、`debugger`、`doc-writer`、`library-integration`、`perf-analyzer`、`refactor`、`shell-expert`、`test-writer`。

## Hook 生命周期

| 事件 | Hook | 用途 |
|------|------|------|
| SessionStart | `session-init.sh` | 记录会话开始状态 |
| SessionStart/compact | `compact-restore.sh` | compact 后恢复关键上下文 |
| PreToolUse | `pre-tool-use.sh` | 拦截危险命令和敏感文件写入 |
| PostToolUse | `post-tool-use.sh` | 自动格式化 + shellcheck |
| PostToolUse/Bash | `log-commands.sh` | 记录所有 Bash 命令 |
| Notification | `notify.sh` | 桌面/语音通知 |
| SessionEnd | `session-summary.sh` | 会话摘要推送 |
| StopFailure | `stop-failure.sh` | 记录异常停止 |
| ConfigChange | `config-audit.sh` | 审计配置变更 |
| CwdChanged/FileChanged | `reload-env.sh` | 环境变量重载 |
| SubagentStart | `log-agent.sh` | 记录 Agent 调用 |

## 代码规范

- Git: Conventional Commits (`type(scope): description`)，见 `.claude/rules/git-conventions.md`
- Python: `.claude/rules/python-style.md` — 基于 Google Style Guide，Python 3.10+
- Shell: `.claude/rules/shell-style.md` — `set -euo pipefail`，`[[ ]]`，双引号变量

## 安全防护

`pre-tool-use.sh` 会自动拦截：
- `rm -rf` 操作系统目录
- 写入 `.env` 文件
- `git push --force`
- 直接 push main/master 分支
- 编辑 `package-lock.json` 和 `.git/` 目录

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
