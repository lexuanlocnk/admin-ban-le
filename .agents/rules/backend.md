# Backend Integration Rules

This repo does not contain backend source code.

When a task touches API behavior:
- Inspect the calling page and `src/axiosConfig.js` first.
- Trace the exact endpoint, params, payload, and response fields used by the frontend.
- Do not assume server architecture, middleware, validators, or controller/service structure.
- Treat permission failures based on observed frontend handling, especially `mess == 'no permission'`.
- If a change requires server implementation, document the frontend expectation clearly instead of inventing backend details.
