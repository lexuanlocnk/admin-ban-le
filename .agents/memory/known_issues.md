# Known Issues

Confirmed repo-specific gotchas from the current code:

- `src/publicRouter.js` checks `localStorage.getItem('admiCN')`; protected auth code uses `adminCN`.
- `src/publicRouter.js` exists but is not wired into `src/App.js`.
- `src/views/pages/login/Login.js` imports `setAuthToken` from `src/axiosConfig.js`, but `axiosConfig.js` does not export it.
- `src/helper/utils.js` uses `moment`, React hooks, and `axiosClient` without importing them.
- `src/views/system/SystemBackup.js` is mostly a UI stub; backup/restore actions only log to console.
- `src/views/seo/LinkManagement.js` currently uses hardcoded sample data instead of real fetch logic.
