# Claude Configuration Index

This directory contains all Claude Code configurations for the oh-my-claude-code project, including custom agents, skills, commands, output styles, and coding rules.

## Agents

| Name | Path | Version | Author | License | Type |
|------|------|---------|--------|---------|------|
| architect | [agents/architect.md](agents/architect.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| code-reviewer | [agents/code-reviewer.md](agents/code-reviewer.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| debugger | [agents/debugger.md](agents/debugger.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| doc-writer | [agents/doc-writer.md](agents/doc-writer.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| library-integration | [agents/library-integration.md](agents/library-integration.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| perf-analyzer | [agents/perf-analyzer.md](agents/perf-analyzer.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| refactor | [agents/refactor.md](agents/refactor.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| shell-expert | [agents/shell-expert.md](agents/shell-expert.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| test-writer | [agents/test-writer.md](agents/test-writer.md) | 1.0.0 | Robin | Apache-2.0 | Local |

## Commands

| Name | Path | Version | Author | License | Type |
|------|------|---------|--------|---------|------|
| precheck | [commands/precheck.md](commands/precheck.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| status | [commands/status.md](commands/status.md) | 1.0.0 | Robin | Apache-2.0 | Local |

## Output Styles

| Name | Path | Version | Author | License | Type |
|------|------|---------|--------|---------|------|
| Chinese-Concise | [output-styles/chinese-concise.md](output-styles/chinese-concise.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| Code-Only | [output-styles/code-only.md](output-styles/code-only.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| Diagrams-First | [output-styles/diagrams-first.md](output-styles/diagrams-first.md) | 1.0.0 | Robin | Apache-2.0 | Local |

## Skills

Skills are organized by functional category. Each skill's `metadata.tags` begins with its category label.

### Pre-commit

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| check | [skills/pre-commit/check/SKILL.md](skills/pre-commit/check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — |
| shell-check | [skills/pre-commit/shell-check/SKILL.md](skills/pre-commit/shell-check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — |

### GitHub

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| codebase-inspection | [skills/github/codebase-inspection/SKILL.md](skills/github/codebase-inspection/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-auth | [skills/github/github-auth/SKILL.md](skills/github/github-auth/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-code-review | [skills/github/github-code-review/SKILL.md](skills/github/github-code-review/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-issues | [skills/github/github-issues/SKILL.md](skills/github/github-issues/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-pr-workflow | [skills/github/github-pr-workflow/SKILL.md](skills/github/github-pr-workflow/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-repo-management | [skills/github/github-repo-management/SKILL.md](skills/github/github-repo-management/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| requesting-code-review | [skills/github/requesting-code-review/SKILL.md](skills/github/requesting-code-review/SKILL.md) | 2.0.0 | Hermes Agent (adapted from obra/superpowers + MorAlekss) | MIT | External | Hermes Agent `skills/` |

### Software Development

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| karpathy-guidelines | [skills/software-development/karpathy-guidelines/SKILL.md](skills/software-development/karpathy-guidelines/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| plan | [skills/software-development/plan/SKILL.md](skills/software-development/plan/SKILL.md) | 2.0.0 | Hermes Agent (writing-craft adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` |
| python-debugpy | [skills/software-development/python-debugpy/SKILL.md](skills/software-development/python-debugpy/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| simplify-code | [skills/software-development/simplify-code/SKILL.md](skills/software-development/simplify-code/SKILL.md) | 1.0.0 | Hermes Agent (inspired by Claude Code /simplify) | MIT | External | Hermes Agent `skills/` |
| systematic-debugging | [skills/software-development/systematic-debugging/SKILL.md](skills/software-development/systematic-debugging/SKILL.md) | 1.1.0 | Hermes Agent (adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` |
| test-driven-development | [skills/software-development/test-driven-development/SKILL.md](skills/software-development/test-driven-development/SKILL.md) | 1.1.0 | Hermes Agent (adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` |

### Research

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| arxiv | [skills/research/arxiv/SKILL.md](skills/research/arxiv/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| blogwatcher | [skills/research/blogwatcher/SKILL.md](skills/research/blogwatcher/SKILL.md) | 2.0.0 | JulienTant (fork of Hyaxia/blogwatcher) | MIT | External | [github.com/JulienTant/blogwatcher-cli](https://github.com/JulienTant/blogwatcher-cli) |
| llm-wiki | [skills/research/llm-wiki/SKILL.md](skills/research/llm-wiki/SKILL.md) | 2.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| tech-doc-translator | [skills/research/tech-doc-translator/SKILL.md](skills/research/tech-doc-translator/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — |

### MLOps

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| audiocraft-audio-generation | [skills/mlops/audiocraft-audio-generation/SKILL.md](skills/mlops/audiocraft-audio-generation/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| evaluating-llms-harness | [skills/mlops/evaluating-llms-harness/SKILL.md](skills/mlops/evaluating-llms-harness/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| huggingface-hub | [skills/mlops/huggingface-hub/SKILL.md](skills/mlops/huggingface-hub/SKILL.md) | 1.0.0 | Hugging Face | MIT | External | Hugging Face |
| llama-cpp | [skills/mlops/llama-cpp/SKILL.md](skills/mlops/llama-cpp/SKILL.md) | 2.1.2 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| obliteratus | [skills/mlops/obliteratus/SKILL.md](skills/mlops/obliteratus/SKILL.md) | 2.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| segment-anything-model | [skills/mlops/segment-anything-model/SKILL.md](skills/mlops/segment-anything-model/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| vllm | [skills/mlops/vllm/SKILL.md](skills/mlops/vllm/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| weights-and-biases | [skills/mlops/weights-and-biases/SKILL.md](skills/mlops/weights-and-biases/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |

## Rules

| Name | Path | Version | Author | License | Type |
|------|------|---------|--------|---------|------|
| git-conventions | [rules/git-conventions.md](rules/git-conventions.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| python-style | [rules/python-style.md](rules/python-style.md) | 1.0.0 | Robin | Apache-2.0 | Local |
| shell-style | [rules/shell-style.md](rules/shell-style.md) | 1.0.0 | Robin | Apache-2.0 | Local |

## Settings & MCP

| Name | Path | Type |
|------|------|------|
| settings.json | [settings.json](settings.json) | Local |
| .mcp.json | [.mcp.json](.mcp.json) | Local |

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
