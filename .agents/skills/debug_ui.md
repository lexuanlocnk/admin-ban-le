# Skill: Debug UI

When debugging UI in this repo:

1. Confirm the page is registered correctly in `src/routes.js` and linked from `src/_nav.js` if needed.
2. Check route params and query params (`useSearchParams`, `location.search`) used by the screen.
3. Verify local state, loading flags, and `useEffect` dependencies around fetch/update flows.
4. For forms, inspect Formik initial values, Yup validation, and field-to-payload mapping.
5. For list pages, check search, pagination, delete modal, and selected-checkbox behavior.
6. For date-based screens, verify `react-datepicker` values and timestamp conversion via `helper/utils.js`.
7. Confirm the UI response path for API failures, especially `toast` messages and `no permission` handling.
