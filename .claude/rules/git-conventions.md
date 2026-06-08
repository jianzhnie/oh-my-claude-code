---
name: git-conventions
description: Git commit conventions for the project, including Conventional Commits format and commit rules.
version: 1.0.0
author: Robin
license: Apache-2.0
platforms: [linux, macos, windows]
metadata:
  tags: [Rule, Git, Conventions, Commit]
  related_skills: []
---

# Git Conventions

## Commit messages

Use Conventional Commits format:

```
type(scope): description
```

Types: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`, `perf`

Scopes map to project directories: `scripts`, `tools`, `docs`, `hooks`

## Commit rules

- Always create a NEW commit — never `--amend` unless explicitly asked
- Never skip pre-commit hooks (`--no-verify`)
- Never force-push to main/master
- Do not commit files that may contain secrets (`.env`, `credentials.json`, etc.)

## Pre-commit hooks

Do not modify the existing hook configuration in `.claude/settings.json` or `.claude/hooks/` unless the user explicitly requests it.
