# Skill: Safe Refactor

For safe refactoring in this repo:

1. Inspect all consumers before changing shared helpers, shared components, routes, or nav config.
2. Keep route paths, query-param behavior, and page-to-page navigation stable.
3. Preserve current `toast`, loading, and `no permission` branches unless the task is explicitly fixing them.
4. Prefer small refactors inside one module before extracting shared code.
5. Re-check the affected list/add/edit flow after the refactor.
