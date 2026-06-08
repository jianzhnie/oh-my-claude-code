# Claude Configuration Index

This directory contains all Claude Code configurations for the oh-my-claude-code project, including custom agents, skills, commands, output styles, and coding rules.

## Agents

| Name | Path | Version | Author | License | Type | Description |
|------|------|---------|--------|---------|------|-------------|
| architect | [agents/architect.md](agents/architect.md) | 1.0.0 | Robin | Apache-2.0 | Local | System architect for high-level design decisions. Use proactively when planning new features, evaluating architectural tradeoffs, designing APIs, or making decisions that affect multiple modules. |
| code-reviewer | [agents/code-reviewer.md](agents/code-reviewer.md) | 1.0.0 | Robin | Apache-2.0 | Local | Expert code review specialist. Proactively reviews code for correctness, security, performance, and maintainability. |
| debugger | [agents/debugger.md](agents/debugger.md) | 1.0.0 | Robin | Apache-2.0 | Local | Debugging specialist for errors, test failures, crashes, and unexpected behavior. |
| doc-writer | [agents/doc-writer.md](agents/doc-writer.md) | 1.0.0 | Robin | Apache-2.0 | Local | Writes and updates documentation, docstrings, and inline comments. |
| library-integration | [agents/library-integration.md](agents/library-integration.md) | 1.0.0 | Robin | Apache-2.0 | Local | Specializes in integrating third-party libraries, SDKs, and APIs into a project. |
| perf-analyzer | [agents/perf-analyzer.md](agents/perf-analyzer.md) | 1.0.0 | Robin | Apache-2.0 | Local | Performance analysis specialist. Investigates throughput issues, memory bottlenecks, latency regressions, or slow operations. |
| refactor | [agents/refactor.md](agents/refactor.md) | 1.0.0 | Robin | Apache-2.0 | Local | Safe code refactoring specialist. Improves structure without changing behavior. |
| shell-expert | [agents/shell-expert.md](agents/shell-expert.md) | 1.0.0 | Robin | Apache-2.0 | Local | Shell script specialist. Writes .sh files, bash scripting, fixing shellcheck warnings, or reviewing shell code. |
| test-writer | [agents/test-writer.md](agents/test-writer.md) | 1.0.0 | Robin | Apache-2.0 | Local | Writes unit and integration tests. Adapts to whatever test framework and conventions the project uses. |

## Commands

| Name | Path | Version | Author | License | Type | Description |
|------|------|---------|--------|---------|------|-------------|
| precheck | [commands/precheck.md](commands/precheck.md) | 1.0.0 | Robin | Apache-2.0 | Local | Run all pre-commit checks before committing. |
| status | [commands/status.md](commands/status.md) | 1.0.0 | Robin | Apache-2.0 | Local | Show current project status at a glance. |

## Output Styles

| Name | Path | Version | Author | License | Type | Description |
|------|------|---------|--------|---------|------|-------------|
| Chinese-Concise | [output-styles/chinese-concise.md](output-styles/chinese-concise.md) | 1.0.0 | Robin | Apache-2.0 | Local | 中文回复，简洁直接，不啰嗦不总结。适合日常开发交互。 |
| Code-Only | [output-styles/code-only.md](output-styles/code-only.md) | 1.0.0 | Robin | Apache-2.0 | Local | 只输出代码和必要的 shell 命令，不解释不总结。适合明确知道要什么的快速实现场景。 |
| Diagrams-First | [output-styles/diagrams-first.md](output-styles/diagrams-first.md) | 1.0.0 | Robin | Apache-2.0 | Local | 解释架构、数据流或代码结构时，先用 Mermaid 图展示，再文字说明。 |

## Skills

| Name | Path | Version | Author | License | Type | External Info | Description |
|------|------|---------|--------|---------|------|---------------|-------------|
| check | [skills/check/SKILL.md](skills/check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — | Run the full pre-commit check suite (shellcheck, ruff, black, isort, mypy, trailing-whitespace, etc.). |
| karpathy-guidelines | [skills/karpathy-guidelines/SKILL.md](skills/karpathy-guidelines/SKILL.md) | — | — | MIT | External | Derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls. | Behavioral guidelines to reduce common LLM coding mistakes. |
| shell-check | [skills/shell-check/SKILL.md](skills/shell-check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — | Validate shell scripts with both syntax check (bash -n) and static analysis (shellcheck). |
| tech-doc-translator | [skills/tech-doc-translator/SKILL.md](skills/tech-doc-translator/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — | Translate English technical documentation (AI/ML, developer tools, API docs) into Chinese Markdown. |

## Rules

| Name | Path | Version | Author | License | Type | Description |
|------|------|---------|--------|---------|------|-------------|
| git-conventions | [rules/git-conventions.md](rules/git-conventions.md) | 1.0.0 | Robin | Apache-2.0 | Local | Git commit conventions for the project, including Conventional Commits format and commit rules. |
| python-style | [rules/python-style.md](rules/python-style.md) | 1.0.0 | Robin | Apache-2.0 | Local | Python coding style guide based on Google Python Style Guide, adapted for modern Python 3.10+. |
| shell-style | [rules/shell-style.md](rules/shell-style.md) | 1.0.0 | Robin | Apache-2.0 | Local | Shell script coding style guide based on Google Shell Style Guide, adapted for bash 4.2+ compatibility. |

## Settings & MCP

| Name | Path | Type | Description |
|------|------|------|-------------|
| settings.json | [settings.json](settings.json) | Local | Project-level Claude Code settings: permissions, hooks, environment variables, plugins, etc. |
| .mcp.json | [.mcp.json](.mcp.json) | Local | MCP (Model Context Protocol) server configuration. |

---

## Frontmatter Standard

All Markdown configuration files in this directory follow a standardized YAML frontmatter format:

```yaml
---
name: <config-name>
description: <brief-description>
version: <semver>
author: <author-name>
license: <spdx-license>
platforms: [linux, macos, windows]
metadata:
  tags: [<tag1>, <tag2>]
  related_skills: [<skill1>, <skill2>]
---
```

- **Local** configs: Author is `Robin`, Version is `1.0.0`, License is `Apache-2.0`.
- **External** configs: Original metadata is preserved. See the External Info column for source details.
