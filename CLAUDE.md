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
