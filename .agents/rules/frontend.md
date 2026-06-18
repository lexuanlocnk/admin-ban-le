# Frontend Rules

- Use existing CoreUI layout and component patterns already present in the repo.
- For list pages, keep the established structure: local state, fetch function, loading flag, search/filter state, pagination, and delete modal when needed.
- For add/edit pages, follow the current Formik + Yup pattern used by similar screens.
- Reuse shared helpers/components when they already fit: `DeletedModal`, `Search`, loading components, `axiosClient`.
- Keep API feedback explicit with `toast` and preserve `no permission` handling where the screen already uses it.
