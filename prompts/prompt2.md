# Role: Claude Configuration Architect

## Context
你负责整理并标准化 `~/.claude` 目录下的所有配置文件（包含 agents, skills, commands, rules, hooks, output-styles 等）。你需要确保所有配置符合 Claude 的规范，并提供完善的文档说明。

## Requirements

### 1. 配置标准化 (YAML Frontmatter)

所有配置文件（如 `.md` 文件）必须包含标准化的 YAML Frontmatter。对于不符合规范的文件，请进行重构或添加缺失字段。

- **Author**: 对于现有的本地配置文件，统一设置为 `"Robin"`。
- **Version**: 统一设置为 `"1.0.0"`。
- **License**: 保持本仓库的 License (`Apache-2.0`)。
- **Platforms**: 保持本仓库的 Platforms 配置 `[linux, macos, windows]`。
- **Metadata**: 
  - 包含 `tags`, `related_skills` 等元数据。
- **外部引入配置**: 保持其原始配置，严禁修改其原始 Author, Version 和 License。

### 2. 标准 YAML 示例
```yaml
---
name: github-code-review
description: "Review PRs: diffs, inline comments via gh or REST."
version: 1.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  tags: [GitHub, Code-Review, Pull-Requests, Git, Quality]
  related_skills: [github-auth, github-pr-workflow]
---
```

### 3. 技能分类与标签化 (Categorization)
对 `skills/` 目录下的配置文件进行智能分类，保存到不同的文件中， 并确保分类逻辑在元数据中同步：
- **分类标准**: 基于功能属性进行归类，预设分类包括但不限于：
  - `Check`: 语法检查、Linter、代码校验。
  - `GitHub`: PR 管理、Issue 处理、Repo 操作。
  - `Dev`: 软件开发、重构、测试生成。
  - `Research`: 知识搜索、技术调研、文档分析。
  - `MLOps`: 模型训练、部署、数据流管理。
- **元数据同步**: 选定的分类必须作为第一个 tag 出现在 YAML Frontmatter 的 `metadata.tags` 中。
- **目录结构**: 分类应直接体现在 `.claude/README.md` 的章节划分中，每个分类为一个二级或三级标题。

### 4. 文档自动化 (README.md)
在 `.claude/README.md` 中维护一份结构化的配置索引，包含以下信息：
- **Name**: 配置文件名称。
- **Path**: 文件相对路径。
- **Version/Author**: 版本及作者信息。
- **Type**: 标注 "Local" (本地原创) 或 "External" (外部引入)。
- **External Info**: 若为外部引入，需说明 GitHub 仓库地址及引入版本。
- **Description**: 核心功能描述。

## Workflow
1. **Inventory**: 遍历 `~/.claude` 目录，识别所有需要标准化的配置文件。
2. **Standardization & Categorization**:
   - 为缺失 Frontmatter 的文件添加标准头。
   - 修正本地配置文件的 Author (`Robin`)、Version (`1.0.0`)、License (`Apache-2.0`)。
   - **智能分类**: 根据技能用途将其归入 `Check`, `GitHub`, `Dev`, `Research`, `MLOps` 或自定义分类，并将分类标签置于 `metadata.tags` 首位。
   - 确保 `platforms` 为 `[linux, macos, windows]`。
3. **Documentation**: 更新 `.claude/README.md`，确保索引与实际文件同步。
4. **Verification**: 检查 YAML 语法是否正确，且文件路径引用准确。

## Definition of Done
- [ ] 所有配置文件均拥有符合规范的 YAML Frontmatter。
- [ ] 所有技能均已按功能模块分类，且 `metadata.tags` 首位为分类标签。
- [ ] 外部引入的配置保持了原始元数据，未被错误修改。
- [ ] `.claude/README.md` 按分类组织，包含完整的配置列表，表格化展示，清晰易读。
