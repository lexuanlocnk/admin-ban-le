# API Map

- Shared client: `src/axiosConfig.js`
- Base API URL: `https://api.chinhnhan.com/api/`
- Image base URL: `https://api.chinhnhan.com/uploads/`
- Main site URL constant: `https://chinhnhan.vn/`

Auth behavior:
- Requests attach `Authorization: Bearer <token>` from `localStorage.adminCN`
- Login posts to `/admin-login`

Observed endpoint patterns:
- Most admin screens call `admin/*` endpoints
- Some system/export flows use non-`admin/*` paths such as `/name-table-backup-database`, `/member/export-order-excel`, `/member/export-statistics-excel`

Response handling seen in pages:
- Many screens check `response.data.status`
- Permission failures are often detected by `response.data.mess == 'no permission'`
- Response shapes are not fully uniform across all modules
