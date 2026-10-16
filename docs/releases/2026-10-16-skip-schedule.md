# Non-sync product schedule columns

The non-sync product list now displays `start_date` and `end_date` from the existing API response, using `DD/MM/YYYY HH:mm`. Unscheduled values display `—`. These are the existing non-sync interval fields used by the add/edit forms, not record creation dates. No API, database or import behavior changes.

The page uses the available content width instead of nesting a fixed-width container. Name, product-code and visibility columns use less space; the action column stays visible while scrolling a narrow table. The existing selection, copy-code, add/edit/delete and filter handlers are unchanged.

Validation: production build, focused component test covering scheduled/unscheduled rows and action presence, browser preview at 1485px (all columns fit) and 1024px (horizontal table scrolling, visible actions, no document overflow). Preview uses fixture rows and is not an authenticated production session.

Deployment target: `/admin.chinhnhan.vn`, inspected before upload. Backup and release evidence: API workspace `storage/app/deploy-backups/skip-schedule-1792116275`. Release changes only feature 8116 JS/CSS, its main-runtime mappings, manifest and index; unrelated local sidebar/domain edits and CKFinder are excluded. Module definitions/imports and JS syntax are checked against the previous production chunk. Assets use new hash names, existing assets remain available, and uploaded files are read back and compared by SHA-256. Public assets/manifest/HTML are checked independently.
