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

### Check

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| check | [skills/01-Check/check/SKILL.md](skills/01-Check/check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — |
| shell-check | [skills/01-Check/shell-check/SKILL.md](skills/01-Check/shell-check/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — |

### GitHub

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| codebase-inspection | [skills/02-GitHub/codebase-inspection/SKILL.md](skills/02-GitHub/codebase-inspection/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-auth | [skills/02-GitHub/github-auth/SKILL.md](skills/02-GitHub/github-auth/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-code-review | [skills/02-GitHub/github-code-review/SKILL.md](skills/02-GitHub/github-code-review/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-issues | [skills/02-GitHub/github-issues/SKILL.md](skills/02-GitHub/github-issues/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-pr-workflow | [skills/02-GitHub/github-pr-workflow/SKILL.md](skills/02-GitHub/github-pr-workflow/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| github-repo-management | [skills/02-GitHub/github-repo-management/SKILL.md](skills/02-GitHub/github-repo-management/SKILL.md) | 1.1.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| requesting-code-review | [skills/02-GitHub/requesting-code-review/SKILL.md](skills/02-GitHub/requesting-code-review/SKILL.md) | 2.0.0 | Hermes Agent (adapted from obra/superpowers + MorAlekss) | MIT | External | Hermes Agent `skills/` |

### Dev

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| karpathy-guidelines | [skills/03-Dev/karpathy-guidelines/SKILL.md](skills/03-Dev/karpathy-guidelines/SKILL.md) | — | — | MIT | External | Derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) |
| plan | [skills/03-Dev/plan/SKILL.md](skills/03-Dev/plan/SKILL.md) | 2.0.0 | Hermes Agent (writing-craft adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` |
| python-debugpy | [skills/03-Dev/python-debugpy/SKILL.md](skills/03-Dev/python-debugpy/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| simplify-code | [skills/03-Dev/simplify-code/SKILL.md](skills/03-Dev/simplify-code/SKILL.md) | 1.0.0 | Hermes Agent (inspired by Claude Code /simplify) | MIT | External | Hermes Agent `skills/` |
| spike | [skills/03-Dev/spike/SKILL.md](skills/03-Dev/spike/SKILL.md) | 1.0.0 | Hermes Agent (adapted from gsd-build/get-shit-done) | MIT | External | Hermes Agent `skills/` |
| systematic-debugging | [skills/03-Dev/systematic-debugging/SKILL.md](skills/03-Dev/systematic-debugging/SKILL.md) | 1.1.0 | Hermes Agent (adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` |
| test-driven-development | [skills/03-Dev/test-driven-development/SKILL.md](skills/03-Dev/test-driven-development/SKILL.md) | 1.1.0 | Hermes Agent (adapted from obra/superpowers) | MIT | External | Hermes Agent `skills/` |

### Research

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| arxiv | [skills/04-Research/arxiv/SKILL.md](skills/04-Research/arxiv/SKILL.md) | 1.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| blogwatcher | [skills/04-Research/blogwatcher/SKILL.md](skills/04-Research/blogwatcher/SKILL.md) | 2.0.0 | JulienTant (fork of Hyaxia/blogwatcher) | MIT | External | [github.com/JulienTant/blogwatcher-cli](https://github.com/JulienTant/blogwatcher-cli) |
| llm-wiki | [skills/04-Research/llm-wiki/SKILL.md](skills/04-Research/llm-wiki/SKILL.md) | 2.1.0 | Hermes Agent | MIT | External | Based on [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) |
| tech-doc-translator | [skills/04-Research/tech-doc-translator/SKILL.md](skills/04-Research/tech-doc-translator/SKILL.md) | 1.0.0 | Robin | Apache-2.0 | Local | — |

### MLOps

| Name | Path | Version | Author | License | Type | External Info |
|------|------|---------|--------|---------|------|---------------|
| audiocraft-audio-generation | [skills/05-MLOps/audiocraft-audio-generation/SKILL.md](skills/05-MLOps/audiocraft-audio-generation/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| evaluating-llms-harness | [skills/05-MLOps/evaluating-llms-harness/SKILL.md](skills/05-MLOps/evaluating-llms-harness/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| huggingface-hub | [skills/05-MLOps/huggingface-hub/SKILL.md](skills/05-MLOps/huggingface-hub/SKILL.md) | 1.0.0 | Hugging Face | MIT | External | Hugging Face |
| llama-cpp | [skills/05-MLOps/llama-cpp/SKILL.md](skills/05-MLOps/llama-cpp/SKILL.md) | 2.1.2 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| obliteratus | [skills/05-MLOps/obliteratus/SKILL.md](skills/05-MLOps/obliteratus/SKILL.md) | 2.0.0 | Hermes Agent | MIT | External | Hermes Agent `skills/` |
| segment-anything-model | [skills/05-MLOps/segment-anything-model/SKILL.md](skills/05-MLOps/segment-anything-model/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| serving-llms-vllm | [skills/05-MLOps/vllm/SKILL.md](skills/05-MLOps/vllm/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |
| weights-and-biases | [skills/05-MLOps/weights-and-biases/SKILL.md](skills/05-MLOps/weights-and-biases/SKILL.md) | 1.0.0 | Orchestra Research | MIT | External | Hermes Agent `skills/` |

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
