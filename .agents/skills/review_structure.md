# Skill: Review Structure

When reviewing structure in this repo:

1. Check whether the target screen already matches patterns used by similar modules in `src/views`.
2. Compare `src/routes.js` and `src/_nav.js` if the change affects navigation or page registration.
3. Look for repeated CRUD patterns that could stay local or move into `components/` or `helper/`.
4. Flag duplicated permission handling, search/pagination logic, or delete-modal flows when the duplication is causing drift.
5. Prefer consistency with existing modules over introducing a new project-wide pattern.
