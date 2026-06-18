# Skill: Debug API

When debugging API usage in this repo:

1. Start with `src/axiosConfig.js` and confirm base URL, auth header, and token source.
2. Trace the exact endpoint string used by the page, including query params and search/filter inputs.
3. Compare request payload fields with the form or local state that builds them.
4. Check how the page interprets `response.data.status`, success payloads, and `mess == 'no permission'`.
5. Verify any related image URL assembly with `imageBaseUrl`.
6. If the page uses hardcoded sample data or stub behavior, note that before assuming a backend problem.
