# Architecture

- This repo is a React admin SPA built with `react-scripts`.
- Entry flow: `src/index.js` mounts `App` inside Redux `Provider`.
- Routing flow: `src/App.js` uses `HashRouter`; protected pages go through `PrivateRoute`.
- Main layout flow: `PrivateRoute` -> `layout/DefaultLayout.js` -> `components/AppContent.js`.
- `src/routes.js` is the route registry for lazy-loaded screens.
- `src/_nav.js` defines sidebar navigation groups and labels.
- Redux in `src/store.js` is minimal and stores UI state only: `sidebarShow` and `theme`.
- Most data fetching happens directly inside page components through `src/axiosConfig.js`.
