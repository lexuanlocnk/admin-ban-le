# Business Logic

This admin app manages many website/admin modules from one UI.

Main module groups visible in routes/nav:
- Admin and permissions: admin info, roles, admin list, admin log, permission groups
- System: system config, system data, system backup, access statistics
- Commerce: products, brands, categories, properties, banners, status, demand, hot/flash sale
- Sales/support: coupons, orders, members, gifts, promotions
- Household section: household ads, household footer, household comments
- Content and communication: support groups, comments, news, advertise, introduce, services, guides, consultant, newsletter
- Contact and settings: department, address, price/contact management, hire, menu, mail template, SEO/social/link pages

Permission handling in the frontend is mostly response-driven:
- Many screens treat `response.data.mess == 'no permission'` as the permission failure path.
- Auth presence is checked from `localStorage.adminCN`.
