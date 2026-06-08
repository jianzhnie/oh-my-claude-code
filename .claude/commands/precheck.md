---
name: precheck
description: Run all pre-commit checks before committing
version: 1.0.0
author: Robin
license: Apache-2.0
platforms: [linux, macos, windows]
metadata:
  tags: [Command, Pre-commit, Lint]
  related_skills: [check]
argument-hint: none
---

Run the full pre-commit suite and report results:

```bash
pre-commit run --all-files
```

If checks pass: "All checks passed" in Chinese.
If any fail: list each failure with the file and fix hint. Suggest running the auto-fixers first (ruff, black, isort) and re-checking.
