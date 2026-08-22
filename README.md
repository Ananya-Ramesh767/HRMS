# Odoo India — HRMS

A hackathon-ready Human Resource Management System (HRMS) built for the **Odoo × NMIT Bangalore selection round**.

The application provides a unified employee and HR workspace for managing employee profiles, attendance, breaks, time off, certifications, payroll, notifications, analytics, and workforce information.

> **Note:** This project intentionally uses mock data and browser `localStorage` instead of a real backend/database, as required for the hackathon prototype.

---

## ✨ Key Features

### 🔐 Authentication & Login

- Employee and HR/Admin login
- Login using email or system Login ID
- Employee self-registration
- HR-controlled employee creation
- Automatic Login ID generation
- Temporary password generation for newly created employees
- Role-based navigation and access

### 👤 Employee Profiles

Each employee has an individual profile containing:

- Profile photo
- Name and employee ID
- Job position
- Department
- Company
- Location
- Date of joining
- Contact information
- About information
- Skills
- Personal interests
- Work preferences
- Individual employee information

Employees can edit supported profile information and update their profile photo.

### 🏆 Certifications

Each employee has an individual certification section.

Certifications support:

- Certification name
- Issuing organization
- Issue date
- Expiry date
- Credential / certification ID
- Description
- Certificate status
- Certificate attachment

Users can:

- Add certifications
- Edit certifications
- Delete certifications
- Attach certificate proof
- Download certificate attachments

Certification data is associated with the relevant employee rather than being stored as one global list.

### ⏱️ Attendance

The attendance module supports:

- Check-in
- Check-out
- Working hours
- Attendance history
- Daily attendance status
- Break tracking
- Start Break
- End Break
- Total break duration
- Net working hours

Break information is integrated directly into the Attendance workflow.

### ☕ Break Tracking

Employees can:

1. Check in
2. Start a break
3. End the break
4. Continue working
5. Check out

The system calculates break duration and uses it when calculating net working hours.

### 🏖️ Time Off / Leave Management

Employees can:

- Apply for time off
- Select leave type
- Select start and end dates
- Add remarks
- Upload supporting proof
- Track request status

HR can:

- View employee leave requests
- Review request details
- View employee information
- Download submitted proof
- Approve requests
- Reject requests
- Add HR comments

### 📎 Proof of Leave Attachments

Time-off requests support optional supporting documents such as:

- Medical certificates
- Emergency documentation
- Other relevant proof

Supported file types include:

- Images
- PDF files

Uploaded attachments are stored as browser data URLs in the mock `localStorage` data layer for the prototype.

### 💰 Payroll

The payroll module provides:

- Employee salary information
- Salary breakdown
- Allowances
- Statutory deductions
- Employee pay information
- HR salary management

All financial information is illustrative mock data for demonstration purposes.

### 📊 HR Dashboard & Analytics

HR users can view workforce-level information including:

- Employee count
- Attendance statistics
- Leave statistics
- Break status
- Workforce summaries
- Time-off breakdown
- HR analytics

### 🔔 Notifications

The application provides notifications for relevant employee and HR actions.

Notifications can be marked as read and are persisted through the mock data layer.

---

## 🎨 UI / UX

The application uses a modern, playful, and professional HR-focused interface designed to make a traditionally administrative HR system feel more engaging.

The UI includes:

- Responsive layouts
- Modern dashboard cards
- Rounded components
- Gradient action buttons
- Status badges
- Interactive modals
- Toast notifications
- Employee avatars
- Micro-interactions
- Responsive tables
- Friendly empty states
- Visual attendance and break indicators
- Odoo India branding

The design uses **Plus Jakarta Sans** and **Sora** typography together with Tailwind CSS utilities and custom CSS.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Tailwind CSS via CDN

### Data & Persistence

- Browser `localStorage`
- Mock data layer
- No external database
- No backend API

### Architecture

The application is intentionally buildless for fast hackathon development.

There is:

- No React
- No Node.js application server
- No bundler
- No npm dependency installation required

JavaScript files are loaded using standard `<script>` tags.

---

## 📁 Project Structure

```text
HRMS/
│
├── index.html
├── README.md
│
├── css/
│   └── styles.css
│
└── js/
    ├── utils.js
    ├── data.js
    ├── icons.js
    ├── components.js
    ├── layout.js
    │
    ├── view-auth.js
    ├── view-dashboard.js
    ├── view-attendance.js
    ├── view-leave.js
    ├── view-payroll.js
    ├── view-profile.js
    ├── view-employees.js
    ├── view-analytics.js
    ├── view-notifications.js
    │
    └── router.js
