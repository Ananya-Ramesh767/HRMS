# Dayflow — HRMS

A hackathon MVP for the Odoo × NMIT Bangalore selection round. Employee & HR
workflows for attendance, time off, payroll, and profiles, built as a
static, no-build front end.

## Tech stack

- Plain HTML / CSS / JavaScript (no framework, no bundler)
- [Tailwind CSS](https://tailwindcss.com) via CDN for styling
- `localStorage` as a mock data layer, standing in for a backend/API

No `npm install` or build step is required — this is intentional for a
fast, dependency-free hackathon demo. See **Next steps** below for how this
slots into a real backend later.

## Running it

Open `index.html` directly in a browser, or serve the folder with any
static file server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit the served URL (or just double-click `index.html`).

## Demo credentials

| Role     | Email                       | Password    |
|----------|------------------------------|-------------|
| HR/Admin | `hr@dayflow.io`               | `Admin@123` |
| Employee | `rahul.verma@dayflow.io`      | `Emp@123`   |

You can also use **Sign Up** to create a new Employee account — self
sign-up is intentionally restricted to the Employee role; HR/Admin accounts
are created from the Employees page by an existing HR user, with an
auto-generated Login ID and temporary password.

## Project structure

```
dayflow-hrms/
├── index.html            # shell + script load order
├── css/
│   └── styles.css        # small custom CSS layer on top of Tailwind
└── js/
    ├── utils.js           # formatting/date/string helpers
    ├── data.js             # mock data layer: seed data, auth, attendance,
    │                       #   leave, payroll, notifications (swap this
    │                       #   module out for real API calls later)
    ├── icons.js            # inline SVG icon set
    ├── components.js       # shared UI: badges, stat cards, modals, toasts
    ├── layout.js            # sidebar / header shell + auth page shell
    ├── view-auth.js         # sign in / sign up
    ├── view-dashboard.js    # employee + HR dashboards
    ├── view-attendance.js   # check-in/out, attendance history
    ├── view-leave.js        # apply / approve / reject time off
    ├── view-payroll.js      # salary breakdown, HR wage editing
    ├── view-profile.js      # profile view (self + view-only for others)
    ├── view-employees.js    # HR employee directory + add employee
    ├── view-analytics.js    # HR analytics
    ├── view-notifications.js
    └── router.js             # hash router + app bootstrap
```

Scripts are loaded as plain `<script>` tags in dependency order (no ES
modules), so every file shares the global scope — that's what keeps this
buildless. If the team moves to React/Vite later, each `js/view-*.js` file
maps closely to one page component, and `data.js` maps to a services layer.

## What's mock / demo data

- All employees, attendance history, leave requests, and notifications are
  seeded on first load into `localStorage` (see `seedDB()` in `data.js`).
- Salary figures are illustrative — no real financial processing occurs.
- Refreshing the page preserves state (it's read from `localStorage`), but
  clearing site data or using a different browser resets to the seed data.

## How dynamic data is handled

Every user action (check in/out, apply/approve/reject leave, edit payroll,
add an employee, mark a notification read) goes through a function in
`data.js` that mutates the `localStorage`-backed store and returns a
result object (`{ ok, error }` or `{ ok, ...data }`). Views never touch
`localStorage` directly. After a successful mutation the app calls
`render()` to re-draw the current page from the updated state, so the
dashboard, attendance history, and notifications all stay in sync without a
page reload.

## Known gaps / next steps

- No real backend — swap `data.js` for real API calls behind the same
  function signatures to connect a server.
- Passwords are stored as plain strings in `localStorage` for demo
  purposes only — never do this in production; use a real auth service
  with hashed passwords server-side.
- No automated tests yet.
- Leave-day counting excludes Sundays only; it doesn't yet account for
  public holidays or half-days.
