# oh-my-claude-code

一套完整的 Claude Code 配置集合，包含自定义 Agents、Skills、Hooks 和 Rules，帮助开发者最大化 Claude Code 的使用效率。

## 目录结构

```
.
├── .claude/
│   ├── agents/          # 自定义 Agent 定义
│   ├── skills/          # 自定义 Skill（check, shell-check 等）
│   ├── hooks/           # 会话生命周期钩子脚本
│   ├── rules/           # 代码规范（Python、Shell、Git）
│   └── settings.json    # Claude Code 项目配置
├── .pre-commit-config.yaml
├── pyproject.toml
└── README.md
```

## 功能特性

### Agents（9 个）

| Agent | 用途 |
|-------|------|
| `architect` | 系统架构设计、API 设计、技术选型 |
| `code-reviewer` | 代码审查（正确性、安全性、性能） |
| `debugger` | 系统性调试与根因分析 |
| `doc-writer` | 文档和 docstring 编写 |
| `library-integration` | 第三方库/SDK 集成 |
| `perf-analyzer` | 性能分析（吞吐量、内存、延迟） |
| `refactor` | 安全重构，不改变行为 |
| `shell-expert` | Shell 脚本编写与审查 |
| `test-writer` | 单元测试和集成测试编写 |

### Skills（4 个）

| Skill | 用途 |
|-------|------|
| `check` | 运行完整 pre-commit 检查 |
| `shell-check` | Shell 脚本语法和静态分析 |
| `karpathy-guidelines` | 减少 LLM 常见编码错误的指导 |
| `tech-doc-translator` | 英文技术文档翻译为中文 |

### Hooks

- **SessionStart**: 会话初始化、compact 恢复
- **PreToolUse**: 工具调用前日志
- **PostToolUse**: 编辑/写入后自动格式化
- **Notification**: 桌面通知推送
- **SessionEnd**: 会话摘要生成
- **StopFailure**: 异常停止处理
- **ConfigChange**: 配置变更审计
- **FileChanged**: `.env` 变更自动重载

### Rules

- `git-conventions.md` — Conventional Commits 规范
- `python-style.md` — Python 代码风格（基于 Google Style Guide）
- `shell-style.md` — Shell 脚本风格

### MCP 服务器

| 服务器 | 用途 |
|--------|------|
| `codegraph` | 代码知识图谱（符号、边、文件索引） |
| `github` | GitHub API 集成 |
| `fetch` | Web 内容获取 |
| `filesystem` | 文件系统访问 |

## 快速开始

### 前置要求

- [Claude Code](https://claude.ai/code) 已安装
- Python >= 3.10（用于 pre-commit hooks）
- [codegraph](https://github.com/anthropics/codegraph)（可选，代码索引）

### 安装

```bash
# 克隆仓库
git clone https://github.com/jianzhnie/oh-my-claude-code.git
cd oh-my-claude-code

# 安装 Python 开发依赖和 pre-commit hooks
pip install -e ".[dev]"
pre-commit install
```

### 使用

将 `.claude/` 目录复制或参考其结构到你自己的项目中，Claude Code 会自动加载配置。

```bash
# 运行代码检查
pre-commit run --all-files

# 运行 lint 和格式化
ruff check .
ruff format .

# 类型检查
mypy .

# 运行测试
pytest
```

## 配置说明

### settings.json

项目级 Claude Code 配置，包括：
- 权限管理（允许/拒绝的命令和 MCP 工具）
- 会话生命周期 hooks
- Worktree 和 StatusLine 配置
- 启用的插件

### pyproject.toml

Python 项目配置，包括 ruff、mypy、pytest 的工具设置。可作为新 Python 项目的起点。

### .pre-commit-config.yaml

Pre-commit hooks：ruff-format、ruff lint、trailing-whitespace、check-yaml、end-of-file-fixer、check-merge-conflict、mixed-line-ending。

## 许可证

Apache-2.0
