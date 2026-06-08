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

Skills are organized by functional category. Each skill's `metadata.tags` begins with its category label.

### Check

| Name | Path | Version | Author | License | Type | External Info | Description |
|------|------|---------|--------|---------|------|---------------|-------------|
| check | [skills/01-Check/check/SKILL.md](skills/01-Check/check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — | Run the full pre-commit check suite (shellcheck, ruff, black, isort, mypy, trailing-whitespace, etc.). Equivalent to ... |
| shell-check | [skills/01-Check/shell-check/SKILL.md](skills/01-Check/shell-check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — | Validate shell scripts with both syntax check (bash -n) and static analysis (shellcheck). Usage: /shell-check [file_o... |

### GitHub

| Name | Path | Version | Author | License | Type | External Info | Description |
|------|------|---------|--------|---------|------|---------------|-------------|
| codebase-inspection | [skills/02-GitHub/codebase-inspection/SKILL.md](skills/02-GitHub/codebase-inspection/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Inspect codebases w/ pygount: LOC, languages, ratios. |
| github-auth | [skills/02-GitHub/github-auth/SKILL.md](skills/02-GitHub/github-auth/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | GitHub auth setup: HTTPS tokens, SSH keys, gh CLI login. |
| github-code-review | [skills/02-GitHub/github-code-review/SKILL.md](skills/02-GitHub/github-code-review/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Review PRs: diffs, inline comments via gh or REST. |
| github-issues | [skills/02-GitHub/github-issues/SKILL.md](skills/02-GitHub/github-issues/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Create, triage, label, assign GitHub issues via gh or REST. |
| github-pr-workflow | [skills/02-GitHub/github-pr-workflow/SKILL.md](skills/02-GitHub/github-pr-workflow/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | GitHub PR lifecycle: branch, commit, open, CI, merge. |
| github-repo-management | [skills/02-GitHub/github-repo-management/SKILL.md](skills/02-GitHub/github-repo-management/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Clone/create/fork repos; manage remotes, releases. |
| requesting-code-review | [skills/02-GitHub/requesting-code-review/SKILL.md](skills/02-GitHub/requesting-code-review/SKILL.md) | 2.0.0 | Hermes Agent (adapted from obra/superpowers + MorAlekss) | MIT | External | Hermes Agent `skills/` | Pre-commit review: security scan, quality gates, auto-fix. |

### Dev

| Name | Path | Version | Author | License | Type | External Info | Description |
|------|------|---------|--------|---------|------|---------------|-------------|
| hermes-agent-skill-authoring | [skills/03-Dev/hermes-agent-skill-authoring/SKILL.md](skills/03-Dev/hermes-agent-skill-authoring/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Author in-repo SKILL.md: frontmatter, validator, structure. |
| karpathy-guidelines | [skills/03-Dev/karpathy-guidelines/SKILL.md](skills/03-Dev/karpathy-guidelines/SKILL.md) | — | — | MIT | External | Derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) | Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid... |
| node-inspect-debugger | [skills/03-Dev/node-inspect-debugger/SKILL.md](skills/03-Dev/node-inspect-debugger/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Debug Node.js via --inspect + Chrome DevTools Protocol CLI. |
| plan | [skills/03-Dev/plan/SKILL.md](skills/03-Dev/plan/SKILL.md) | 2.0.0 | Hermes Agent (writing-craft adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` | Plan mode: write an actionable markdown plan to .hermes/plans/, no execution. Bite-sized tasks, exact paths, complete... |
| python-debugpy | [skills/03-Dev/python-debugpy/SKILL.md](skills/03-Dev/python-debugpy/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Debug Python: pdb REPL + debugpy remote (DAP). |
| simplify-code | [skills/03-Dev/simplify-code/SKILL.md](skills/03-Dev/simplify-code/SKILL.md) | 1.0.0 | Hermes Agent (inspired by Claude Code /simplify) | MIT | External | Hermes Agent `skills/` | Parallel 3-agent cleanup of recent code changes. |
| spike | [skills/03-Dev/spike/SKILL.md](skills/03-Dev/spike/SKILL.md) | 1.0.0 | Hermes Agent (adapted from gsd-build/get-shit-done) | MIT | External | Hermes Agent `skills/` | Throwaway experiments to validate an idea before build. |
| systematic-debugging | [skills/03-Dev/systematic-debugging/SKILL.md](skills/03-Dev/systematic-debugging/SKILL.md) | 1.1.0 | Hermes Agent (adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` | 4-phase root cause debugging: understand bugs before fixing. |
| test-driven-development | [skills/03-Dev/test-driven-development/SKILL.md](skills/03-Dev/test-driven-development/SKILL.md) | 1.1.0 | Hermes Agent (adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` | TDD: enforce RED-GREEN-REFACTOR, tests before code. |

### Research

| Name | Path | Version | Author | License | Type | External Info | Description |
|------|------|---------|--------|---------|------|---------------|-------------|
| arxiv | [skills/04-Research/arxiv/SKILL.md](skills/04-Research/arxiv/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | Search arXiv papers by keyword, author, category, or ID. |
| blogwatcher | [skills/04-Research/blogwatcher/SKILL.md](skills/04-Research/blogwatcher/SKILL.md) | 2.0.0 | JulienTant (fork of Hyaxia/blogwatcher) | MIT | External | [github.com/JulienTant/blogwatcher-cli](https://github.com/JulienTant/blogwatcher-cli) | Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool. |
| llm-wiki | [skills/04-Research/llm-wiki/SKILL.md](skills/04-Research/llm-wiki/SKILL.md) | 2.1.0 | Hermes Agent | MIT | External | Based on [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) | Karpathy's LLM Wiki: build/query interlinked markdown KB. |
| obsidian | [skills/04-Research/obsidian/SKILL.md](skills/04-Research/obsidian/SKILL.md) | — | — | — | External | Hermes Agent `skills/note-taking/` | Read, search, create, and edit notes in the Obsidian vault. |
| tech-doc-translator | [skills/04-Research/tech-doc-translator/SKILL.md](skills/04-Research/tech-doc-translator/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — | Use when translating English technical documentation (AI/ML, developer tools, API docs) into Chinese Markdown. Trigge... |

### MLOps

| Name | Path | Version | Author | License | Type | External Info | Description |
|------|------|---------|--------|---------|------|---------------|-------------|
| audiocraft-audio-generation | [skills/05-MLOps/audiocraft-audio-generation/SKILL.md](skills/05-MLOps/audiocraft-audio-generation/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` | AudioCraft: MusicGen text-to-music, AudioGen text-to-sound. |
| evaluating-llms-harness | [skills/05-MLOps/evaluating-llms-harness/SKILL.md](skills/05-MLOps/evaluating-llms-harness/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` | lm-eval-harness: benchmark LLMs (MMLU, GSM8K, etc.). |
| huggingface-hub | [skills/05-MLOps/huggingface-hub/SKILL.md](skills/05-MLOps/huggingface-hub/SKILL.md) | 1.0.0 | Hugging Face | MIT | External | Hugging Face | HuggingFace hf CLI: search/download/upload models, datasets. |
| llama-cpp | [skills/05-MLOps/llama-cpp/SKILL.md](skills/05-MLOps/llama-cpp/SKILL.md) | 2.1.2 | Orchestra Research | MIT | External | Hermes Agent `skills/` | llama.cpp local GGUF inference + HF Hub model discovery. |
| obliteratus | [skills/05-MLOps/obliteratus/SKILL.md](skills/05-MLOps/obliteratus/SKILL.md) | 2.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` | OBLITERATUS: abliterate LLM refusals (diff-in-means). |
| segment-anything-model | [skills/05-MLOps/segment-anything-model/SKILL.md](skills/05-MLOps/segment-anything-model/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` | SAM: zero-shot image segmentation via points, boxes, masks. |
| serving-llms-vllm | [skills/05-MLOps/vllm/SKILL.md](skills/05-MLOps/vllm/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` | vLLM: high-throughput LLM serving, OpenAI API, quantization. |
| weights-and-biases | [skills/05-MLOps/weights-and-biases/SKILL.md](skills/05-MLOps/weights-and-biases/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` | W&B: log ML experiments, sweeps, model registry, dashboards. |

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
  tags: [<category>, <tag1>, <tag2>]
  related_skills: [<skill1>, <skill2>]
---
```

- **Local** configs: Author is `Robin`, Version is `1.0.0`, License is `Apache-2.0`.
- **External** configs: Original metadata (Author, Version, License) is preserved. Category tag is added to `metadata.tags` for organization.
- Skills are categorized into: `Check`, `GitHub`, `Dev`, `Research`, `MLOps`.
- Skills are stored under `skills/<category-folder>/<skill-name>/`.
