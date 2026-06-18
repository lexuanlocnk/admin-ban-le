# Coding Rules

Match the style already used in this repo:

- JavaScript only. Do not introduce TypeScript-specific guidance.
- Keep semicolon-free style, single quotes, 2-space indentation, and trailing commas.
- Prefer functional React components.
- Follow existing module patterns before introducing new abstractions.
- For route pages, check similar screens in `src/views` first and copy the established structure when possible.
- Keep API calls through `axiosClient` from `src/axiosConfig.js`.
- Preserve existing user feedback patterns: `toast`, loading flags, permission checks, and delete confirmation modal flows.
- Avoid broad refactors unless the same change is needed in multiple screens.
