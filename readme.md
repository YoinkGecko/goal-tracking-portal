# Goal Tracking & Performance Management Portal

A full-stack platform for organizational goal setting, manager review workflows, quarterly progress tracking, admin oversight, and async email notifications. Employees define weighted goals on goal sheets; managers approve or return them; everyone tracks quarterly achievement with audit trails and exportable reports.

![Architecture](./Architecture%20diagram.png)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Goal Sheet Workflow](#goal-sheet-workflow)
- [Business Rules](#business-rules)
- [Quarterly Update Windows](#quarterly-update-windows)
- [Progress Scoring (UOM)](#progress-scoring-uom)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Notification Service](#notification-service)
- [Frontend Routes](#frontend-routes)
- [Development Tips](#development-tips)
- [Security Notes](#security-notes)

---

## Overview

This application supports a typical performance-management cycle:

1. **Employee** creates a goal sheet, adds goals (thrust area, targets, weightage), and submits when ready.
2. **Manager** reviews submitted sheets from direct reports—approve or return for revision.
3. **Employee** records quarterly actuals on approved sheets; progress is calculated automatically.
4. **Manager** adds feedback comments on quarterly updates.
5. **Admin** monitors org-wide status, unlocks locked sheets, exports CSV reports, and reviews audit logs.

Authentication is **JWT-based** with **role-based access control (RBAC)** on every protected route.

---

## Key Features

| Area | Capabilities |
|------|----------------|
| **Authentication** | Register, login, JWT (7-day expiry), bcrypt password hashing |
| **Goal sheets** | Draft → Submit → Approve / Return lifecycle; admin unlock |
| **Goals** | Up to 8 goals per sheet; min 10% weight each; total must equal 100% to submit |
| **Quarterly updates** | Per-goal, per-quarter actuals; auto progress score & status |
| **Manager feedback** | Comments on quarterly update records |
| **Reports** | Achievement report, completion dashboard, detailed CSV, audit log CSV |
| **Audit trail** | Logs goal updates and goal sheet state changes (approve, return, unlock) |
| **Notifications** | BullMQ + Redis queue; Nodemailer worker for async email (separate service) |

### By Role

**Employee**
- Create and manage draft/returned goal sheets
- Add and edit goals (while sheet is editable)
- Submit goal sheet for manager review
- Submit quarterly updates after approval
- View manager comments

**Manager**
- View all goal sheets for assigned employees
- Approve or return submitted sheets
- Add comments on quarterly updates
- Access achievement and completion reports

**Admin**
- Organization dashboard (counts, recent sheets, audit preview)
- Unlock approved goal sheets (reverts to `RETURNED`)
- Export detailed performance CSV and audit log CSV
- Full reporting access

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios |
| **Backend API** | Node.js, Express 5 |
| **ORM** | Prisma 6 |
| **Database** | MySQL |
| **Auth** | JSON Web Tokens, bcrypt |
| **Queue** | BullMQ, Redis |
| **Email** | Nodemailer (Gmail SMTP) |
| **Exports** | json2csv |
| **Security** | Helmet, CORS, Morgan logging |

---

## System Architecture

```mermaid
flowchart TB
    subgraph Users
        E[Employee]
        M[Manager]
        A[Admin]
    end

    subgraph Frontend["React SPA (Vite)"]
        UI[Role-based dashboards & forms]
    end

    subgraph Backend["Node.js + Express"]
        API[REST API + JWT middleware]
        SVC[Services: GoalSheet, Goal, Quarterly, Report, Audit]
        PRISMA[Prisma ORM]
    end

    subgraph Data
        DB[(MySQL)]
    end

    subgraph Async["Notification Service"]
        PROD[Producer / future hooks]
        REDIS[(Redis)]
        WORK[Worker]
        SMTP[Nodemailer SMTP]
    end

    E & M & A --> UI
    UI -->|HTTP /api| API
    API --> SVC --> PRISMA --> DB
    API -.->|enqueue email jobs| PROD
    PROD --> REDIS --> WORK --> SMTP
```

**Layers**

1. **Presentation** — React SPA with routes per role (`/employee`, `/manager`, `/admin`).
2. **API** — Express routes, `authMiddleware`, `roleMiddleware`, controllers → services.
3. **Data** — Prisma models: `User`, `GoalSheet`, `Goal`, `QuarterlyUpdate`, `AuditLog`.
4. **Async notifications** — Standalone `Notification-service/` consumes `email-queue` via BullMQ (decoupled from request/response path).

---

## Project Structure

```
goal-tracking-portal/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── pages/            # Login, Employee/Manager/Admin dashboards, goal details
│   │   ├── services/         # api.js, goalService.js, adminService.js
│   │   └── layouts/
│   └── package.json
├── src/                      # Express backend
│   ├── routes/               # auth, goal-sheets, goals, quarterly-updates, reports, admin
│   ├── controllers/
│   ├── services/             # Business logic
│   ├── middleware/           # JWT auth, RBAC
│   └── utils/                # Token, password hash, quarter window
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── Notification-service/     # BullMQ worker + sample producer
│   ├── worker.js
│   └── producer.js
├── Architecture diagram.png
├── package.json              # Backend dependencies
└── README.md
```

---

## Prerequisites

Install before running locally:

- **Node.js** 18+ (LTS recommended)
- **MySQL** 8+
- **Redis** (for notification queue)
- **npm** or **yarn**

Optional for email notifications:

- Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

---

## Quick Start

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd goal-tracking-portal

# Backend
npm install

# Frontend
cd frontend && npm install && cd ..

# Notification service
cd Notification-service && npm install && cd ..
```

### 2. Configure environment

Create a `.env` file in the **project root** (backend):

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/goal_tracking"
JWT_SECRET="your-long-random-secret"
PORT=5000

# Optional: override calendar month for quarterly window tests (1-12)
# TEST_MONTH=7
```

Create `Notification-service/.env`:

```env
EMAIL_PASS="your-gmail-app-password"
```

### 3. Database setup

```bash
# From project root
npx prisma migrate deploy
# Or during development:
npx prisma migrate dev
```

### 4. Start Redis

```bash
redis-server
```

### 5. Run all services

**Terminal 1 — API**

```bash
npm run dev
# Server: http://localhost:5000 (or PORT from .env)
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
# Vite default: http://localhost:5173
```

**Terminal 3 — Email worker**

```bash
cd Notification-service
node worker.js
```

**Terminal 4 — (Optional) Test queue producer**

```bash
cd Notification-service
node producer.js
```

### 6. Align frontend API URL

The frontend Axios client is configured in `frontend/src/services/api.js`. Update `baseURL` to match your backend port:

```js
baseURL: "http://localhost:5000/api"  // default backend PORT is 5000
```

> **Note:** The repo currently points to port `8000`. Change this if your API runs on `5000`.

### 7. Create users

Use the register endpoint (or Prisma Studio) to seed users. Employees should have `managerId` set to their manager's user ID for approval flows to work.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Employee",
    "email": "jane@company.com",
    "password": "securePassword123",
    "role": "EMPLOYEE"
  }'
```

Roles: `EMPLOYEE` | `MANAGER` | `ADMIN`

---

## Environment Variables

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | Backend | Yes | MySQL connection string for Prisma |
| `JWT_SECRET` | Backend | Yes | Secret for signing JWTs |
| `PORT` | Backend | No | API port (default: `5000`) |
| `TEST_MONTH` | Backend | No | Force quarter window month (1–12) for testing |
| `EMAIL_PASS` | Notification-service | Yes (for email) | Gmail app password for Nodemailer |

---

## Goal Sheet Workflow

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Employee creates sheet
    DRAFT --> SUBMITTED: Submit (goals + 100% weight)
    RETURNED --> SUBMITTED: Resubmit after edits
    SUBMITTED --> APPROVED: Manager approves
    SUBMITTED --> RETURNED: Manager returns
    APPROVED --> RETURNED: Admin unlocks
    APPROVED --> [*]: Quarterly updates enabled
```

| Status | Who can act | What’s allowed |
|--------|-------------|----------------|
| `DRAFT` | Employee | Add/edit goals, submit |
| `SUBMITTED` | Manager | Approve or return |
| `RETURNED` | Employee | Edit goals, resubmit |
| `APPROVED` | Employee | Quarterly updates only |
| `LOCKED` | — | Reserved in schema; unlock path uses `RETURNED` via admin |

**Submit validation**
- At least one goal
- Sum of `weightage` across all goals = **100**
- Sheet status must be `DRAFT` or `RETURNED`

---

## Business Rules

### Goals

- Maximum **8** goals per active draft sheet
- Minimum **10%** weight per goal
- Goals can only be created on a sheet in `DRAFT` status
- Goals can only be updated when sheet is `DRAFT` or `RETURNED`
- Only one active sheet per employee (`DRAFT`, `SUBMITTED`, or `RETURNED`)

### Manager authorization

- Managers may only approve/return sheets for employees where `employee.managerId === manager.id`

### Quarterly updates

- Allowed only when goal sheet status is `APPROVED`
- One update per goal per quarter (no duplicates)
- Quarter must be within the [update window](#quarterly-update-windows)

### Audit logging

Recorded for:
- Goal sheet: `APPROVE`, `RETURN`, `UNLOCK`
- Goal: `UPDATE` (with old/new JSON snapshots)

---

## Quarterly Update Windows

Updates are accepted only during specific calendar months (Indian financial year quarters):

| Quarter | Open month(s) |
|---------|----------------|
| **Q1** | July (7) |
| **Q2** | October (10) |
| **Q3** | January (1) |
| **Q4** | March (3) or April (4) |

For local testing without waiting for the calendar:

```env
TEST_MONTH=7   # Simulates July → Q1 window open
```

---

## Progress Scoring (UOM)

Each goal has a **Unit of Measure** (`uomType`) that drives `progressScore`:

| UOM Type | Formula | Use case |
|----------|---------|----------|
| `MIN` | `(actual / target) × 100` | Higher actual is better (e.g. revenue) |
| `MAX` | `(target / actual) × 100` | Lower actual is better (e.g. defects) |
| `ZERO` | `100` if actual === 0, else `0` | Zero-tolerance metrics |
| `TIMELINE` | `0` (placeholder) | Timeline-based goals |

**Auto status** (from score after update):

| Condition | Status |
|-----------|--------|
| `progressScore >= 100` | `COMPLETED` |
| `progressScore > 0` | `ON_TRACK` |
| Otherwise | `NOT_STARTED` |

---

## API Reference

Base URL: `http://localhost:<PORT>/api`

### Authentication

All protected routes require:

```
Authorization: Bearer <jwt_token>
```

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register user |
| `POST` | `/auth/login` | Public | Login, returns token + user |

**Register / Login body**

```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "yourPassword",
  "role": "EMPLOYEE"
}
```

---

### Goal Sheets

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/goal-sheets` | Employee | Create new goal sheet |
| `GET` | `/goal-sheets` | Employee | List own goal sheets |
| `GET` | `/goal-sheets/:id` | Employee | Get goal sheet by ID |
| `POST` | `/goal-sheets/:id/submit` | Employee | Submit for review |
| `GET` | `/goal-sheets/manager` | Manager | List team goal sheets |
| `GET` | `/goal-sheets/manager/:id` | Manager | Get team member sheet |
| `POST` | `/goal-sheets/:id/approve` | Manager | Approve submitted sheet |
| `POST` | `/goal-sheets/:id/return` | Manager | Return for revision |
| `POST` | `/goal-sheets/:id/unlock` | Admin | Unlock approved → returned |

---

### Goals

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/goals` | Employee | Add goal to draft sheet |
| `PUT` | `/goals/:id` | Employee | Update goal |

**Create goal body**

```json
{
  "thrustArea": "Revenue Growth",
  "title": "Increase enterprise sales",
  "description": "Close 10 new enterprise accounts",
  "uomType": "MIN",
  "targetValue": 10,
  "weightage": 25
}
```

`uomType`: `MIN` | `MAX` | `TIMELINE` | `ZERO`

---

### Quarterly Updates

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/quarterly-updates/:goalId` | Employee | Create quarterly update |
| `POST` | `/quarterly-updates/:id/comment` | Manager | Add manager comment |

**Create update body**

```json
{
  "quarter": "Q1",
  "actualValue": 8.5
}
```

`quarter`: `Q1` | `Q2` | `Q3` | `Q4`

**Comment body**

```json
{
  "comment": "Strong progress—keep momentum on enterprise pipeline."
}
```

---

### Reports

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/reports/achievement` | Admin, Manager | Flat achievement rows |
| `GET` | `/reports/dashboard` | Admin, Manager | Counts by sheet status |
| `GET` | `/reports/export/csv` | Admin | Detailed CSV download |
| `GET` | `/reports/export/audit` | Admin | Audit log CSV download |

---

### Admin

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/dashboard` | Admin | Stats, goal sheets, recent audit logs |

---

### Test routes (RBAC smoke test)

| Method | Endpoint | Role |
|--------|----------|------|
| `GET` | `/test/employee` | Employee |
| `GET` | `/test/manager` | Manager |
| `GET` | `/test/admin` | Admin |

---

### Response format

**Success**

```json
{
  "success": true,
  "data": { }
}
```

**Error**

```json
{
  "success": false,
  "message": "Human-readable error"
}
```

---

## Database Schema

```mermaid
erDiagram
    User ||--o{ GoalSheet : owns
    User ||--o{ User : manages
    User ||--o{ AuditLog : performs
    GoalSheet ||--|{ Goal : contains
    Goal ||--o{ QuarterlyUpdate : tracks

    User {
        int id PK
        string name
        string email UK
        string password
        enum role
        int managerId FK
    }

    GoalSheet {
        int id PK
        int employeeId FK
        enum status
        datetime submittedAt
        datetime approvedAt
    }

    Goal {
        int id PK
        int goalSheetId FK
        string thrustArea
        string title
        string description
        enum uomType
        float targetValue
        float weightage
    }

    QuarterlyUpdate {
        int id PK
        int goalId FK
        enum quarter
        float plannedValue
        float actualValue
        enum status
        float progressScore
        string managerComment
    }

    AuditLog {
        int id PK
        int userId FK
        string entityType
        int entityId
        string action
        json oldValue
        json newValue
    }
```

Run Prisma Studio to inspect data:

```bash
npx prisma studio
```

---

## Notification Service

The `Notification-service/` folder runs **outside** the main API process:

| File | Purpose |
|------|---------|
| `producer.js` | Sample script to enqueue jobs on `email-queue` |
| `worker.js` | BullMQ worker: reads jobs, sends mail via Nodemailer |

**Job payload shape**

```json
{
  "email": "recipient@company.com",
  "subject": "Goal sheet approved",
  "body": "Your goal sheet has been approved by your manager."
}
```

**End-to-end flow (target integration)**

1. Manager approves a goal sheet in the API.
2. API persists status and enqueues an email job to Redis.
3. Worker picks up the job and sends via Gmail SMTP.
4. Employee receives notification (retries handled by BullMQ).

> The main API does not yet call the producer on approve/return—wire `producer` logic into `goalSheet.service.js` when ready.

**Requirements**
- Redis on `127.0.0.1:6379`
- `EMAIL_PASS` in `Notification-service/.env`
- Update hardcoded SMTP `user` in `worker.js` for your sender address

---

## Frontend Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Login | Public |
| `/employee` | Employee dashboard | Employee |
| `/employee/goals/:id` | Goal sheet details | Employee |
| `/manager` | Manager dashboard | Manager |
| `/manager/goals/:id` | Review goal sheet | Manager |
| `/admin` | Admin dashboard | Admin |

Auth state is stored in `localStorage` (`token`, `user`). Role from login determines redirect.

---

## Development Tips

| Task | Command |
|------|---------|
| API with hot reload | `npm run dev` (nodemon) |
| Frontend dev server | `cd frontend && npm run dev` |
| Lint frontend | `cd frontend && npm run lint` |
| Apply migrations | `npx prisma migrate dev` |
| Reset DB (destructive) | `npx prisma migrate reset` |
| Generate Prisma client | `npx prisma generate` |

**Port checklist**

| Service | Default |
|---------|---------|
| Backend API | `5000` (`PORT` env) |
| Frontend (Vite) | `5173` |
| Frontend → API (`api.js`) | Should match backend (update if needed) |
| Redis | `6379` |

**Testing quarterly windows**

Set `TEST_MONTH` in backend `.env` to the month that opens the quarter you need (see [table](#quarterly-update-windows)).

---

## Security Notes

- Never commit `.env` files (already in `.gitignore`).
- Use a strong, unique `JWT_SECRET` in production.
- Replace default/hardcoded SMTP credentials in `Notification-service/worker.js`.
- Register endpoint is public—restrict or remove in production, or protect behind admin-only provisioning.
- Helmet and CORS are enabled; tighten CORS origins for production deployments.
- Passwords are hashed with bcrypt before storage.

---

## License

ISC (see `package.json`).

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes with clear messages.
4. Open a pull request describing workflow or API changes.

---

Built for transparent goal tracking, manager accountability, and audit-ready performance management.
