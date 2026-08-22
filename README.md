# Dayflow — HRMS

## Odoo × NMIT Bangalore Hackathon Project

Dayflow is a lightweight Human Resource Management System (HRMS) web application developed for the **Odoo × NMIT Bangalore Hackathon**. It provides a simple, interactive platform for managing employee and HR workflows such as attendance, breaks, leave, payroll, employee profiles, and HR analytics.

🔗 **Live Demo:** https://ananya-ramesh767.github.io/HRMS/

## Quick Start

No installation or setup is required.

Simply open `index.html` in a browser, or visit the live demo:

**Live Demo:** https://ananya-ramesh767.github.io/HRMS/

The application runs entirely on the client side using HTML, CSS, JavaScript, and browser `localStorage`.

## Demo Login

| Role     | Email                    | Password    |
| -------- | ------------------------ | ----------- |
| HR/Admin | `hr@dayflow.io`          | `Admin@123` |
| Employee | `rahul.verma@dayflow.io` | `Emp@123`   |

New employees can also create an account using the **Sign Up** tab.

## Tech Stack

* **HTML / CSS / JavaScript** — no framework and no build step
* **Tailwind CSS** — loaded through CDN
* **localStorage** — used as a mock backend and data layer
* **Responsive UI** — designed for convenient use across different screen sizes

## Key Features

### Role-Based Access

* Separate **HR/Admin** and **Employee** views
* Role-specific dashboards and permissions
* Employees can manage their own information
* HR/Admin can manage and monitor employee-related workflows

### Attendance & Break Tracking

* Employee check-in and check-out
* Attendance history
* Daily attendance tracking
* Break tracking during working hours
* HR dashboard with live attendance status and activity overview

### Leave Management

* Employees can apply for leave
* Leave request history and status tracking
* HR can approve or reject leave requests
* Support for **proof-of-leave attachments**
* Pending leave requests are visible to HR/Admin for quick action

### Payroll

* Employee payroll information and salary breakdown
* HR-editable payroll details
* Clear presentation of salary and financial information
* Illustrative payroll data for demonstration purposes

### Employee Profiles

* Individual employee profile pages
* **Profile photos for individual employees**
* Editable **About** sections for personalized employee information
* Employees can update their own profile details
* Support for Skills and Certifications
* Bank and Private Information sections
* HR can view employee profiles while Work Information remains HR-managed

### HR Dashboard & Analytics

* Live attendance pulse
* Pending leave approvals
* Employee overview
* Attendance and workflow analytics
* Interactive charts and dashboard statistics

### Notifications

* Centralized notification view
* Updates related to attendance, leave, payroll, and HR actions
* Helps employees and HR stay informed about important activities

## Project Workflow

The application follows a simple HR workflow:

**Authentication → Dashboard → Attendance & Breaks → Leave Management → Payroll → Employee Profiles → Notifications & Analytics**

This provides employees with the tools they need for everyday HR activities while giving HR/Admin users centralized control over employee management and approvals.

## Project Structure

```text
dayflow-hrms/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── data.js
    ├── utils.js
    ├── icons.js
    ├── components.js
    ├── layout.js
    ├── router.js
    └── view-*.js
        ├── authentication
        ├── dashboard
        ├── attendance
        ├── leave
        ├── payroll
        ├── profile
        ├── employees
        ├── analytics
        └── notifications
```

### Main JavaScript Modules

* `data.js` — mock data layer, seed data, authentication, and business logic
* `utils.js` — reusable helper functions
* `icons.js` — application icons
* `components.js` — reusable UI components
* `layout.js` — common application layout
* `router.js` — page navigation and routing
* `view-*.js` — individual application pages and workflows

## Data & Storage

Dayflow is designed as a fully self-contained frontend application.

* Initial application data is seeded into browser `localStorage`
* No external database or backend server is required
* User actions update the stored application state
* Refreshing the page preserves the current state
* Clearing browser storage resets the application to its initial seed data

## Notes for Evaluators

* The application is completely self-contained and can be demonstrated without server-side setup.
* Demo accounts are provided for both HR/Admin and Employee roles.
* Salary and financial figures are **illustrative demo data only**.
* Browser `localStorage` is used as a mock backend/data layer.
* The application demonstrates complete frontend workflows for attendance, break tracking, leave management, payroll, profiles, notifications, and HR analytics.

## Conclusion

Dayflow is a practical HRMS prototype that brings essential employee and HR workflows together in a single, easy-to-use platform. Built for the **Odoo × NMIT Bangalore Hackathon**, it focuses on clear role-based access, efficient HR operations, employee self-service, and an interactive user experience.

By combining attendance and break tracking, leave management with proof attachments, payroll, personalized employee profiles, profile photos, notifications, and HR analytics, Dayflow demonstrates how a lightweight web-based HRMS can simplify everyday workforce management while remaining simple, self-contained, and easy to use.

**Dayflow — Simplifying HR management through a unified, employee-friendly digital experience.**
