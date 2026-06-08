---
name: check
description: Run the full pre-commit check suite (shellcheck, ruff, black, isort,
  mypy, trailing-whitespace, etc.). Equivalent to pre-commit run --all-files.
version: 1.0.0
author: Robin
license: Apache-2.0
platforms:
- linux
- macos
- windows
metadata:
  tags:
  - Check
  - Skill
  - Pre-commit
  - Lint
  - Quality
  related_skills:
  - shell-check
---
Run the complete pre-commit check suite for the project:

```bash
pre-commit run --all-files
```

Report each hook result: PASS or FAIL with details. If any hook fails, list the affected files and the specific issues so the user can fix them.
