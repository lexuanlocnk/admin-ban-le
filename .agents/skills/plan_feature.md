# Skill: Plan Feature

For a new feature or module change in this repo:

1. Identify the closest existing screen in `src/views` to mirror.
2. Check whether the change needs updates in:
   - `src/routes.js`
   - `src/_nav.js`
   - an existing list page
   - an add/edit page
   - shared components or helpers
3. List the current API endpoints already used by the target module or a similar module.
4. Preserve established patterns:
   - `axiosClient` calls inside the page
   - loading state
   - `toast` feedback
   - permission handling with `no permission`
   - pagination/search/query-param behavior where present
5. Define manual checks for the affected flow before implementation.
