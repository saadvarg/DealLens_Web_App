# DealLens Web App

> Enterprise equipment finance workflow — screen PDFs, review AI recommendations, manage underwriting, and configure credit policy from a single interface.



---

## What is DealLens?

DealLens is a standalone React/Vite web client for enterprise equipment finance teams. It connects to the DealLens API backend and gives underwriters, analysts, and credit managers a unified workspace to:

- **Screen financial PDFs** with borrower and equipment metadata
- **Review AI-generated recommendations** before making credit decisions
- **Manage deal status** across the full underwriting lifecycle
- **Track pipeline health** with pursue / review / pass metrics
- **Configure credit policy** and team integrations in one place

> This repository contains only the web client. A running [DealLens API](https://github.com/your-org/deallens-api) backend is required.

---

## Screenshots

| Dashboard | Deal Queue | PDF Screening |
|-----------|------------|---------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Deal Queue](./screenshots/deal-queue.png) | ![PDF Screening](./screenshots/pdf-screening.png) |

| Deal Detail | Analytics | Credit Policy |
|-------------|-----------|---------------|
| ![Deal Detail](./screenshots/deal-detail.png) | ![Analytics](./screenshots/analytics.png) | ![Credit Policy](./screenshots/credit-policy.png) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running [DealLens API](https://github.com/your-org/deallens-api) instance

### Install & Run

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and set your values:

```env
VITE_DEALLENS_API_BASE_URL=http://localhost:3000
```

For production, point `VITE_DEALLENS_API_BASE_URL` at your deployed DealLens API URL.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `localhost:5173` |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Features

### Authentication
Email/password login authenticated against the DealLens API. Session-based access control with protected routes.

### Workspace Dashboard
At-a-glance pipeline health with pursue / review / pass metrics. Designed for team leads and credit managers who need a fast read on deal flow.

![Dashboard Overview](./screenshots/dashboard.png)

### PDF Screening
Upload and screen financial PDFs with structured borrower and equipment metadata. AI extracts key signals and surfaces a recommendation for underwriter review.

![PDF Screening Form](./screenshots/pdf-screening.png)

### Deal Queue & Detail
Searchable, filterable deal queue. Click into any deal for full detail — AI report, status history, document attachments, and one-click status changes.

![Deal Queue](./screenshots/deal-queue.png)

### Report Export
Export deal reports in structured format for audit trails, compliance, or external review.

### Analytics View
Track team throughput, approval rates, and pipeline velocity over time.

![Analytics](./screenshots/analytics.png)

### Lifecycle Tracking
Visual lifecycle stages from application submission through close or pass.

### Team & Integrations
Manage team members, roles, and third-party integrations from the settings panel.

### Credit Policy Configuration
Define and update credit policy rules that feed into AI screening logic — without touching code.

![Credit Policy](./screenshots/credit-policy.png)

### Responsive Layout
Full desktop and mobile support. Optimized for underwriters at their desk and managers checking status on the go.

---

## Project Structure

```
src/
├── components/       # Shared UI components
├── pages/            # Route-level views
│   ├── Dashboard/
│   ├── Deals/
│   ├── Screening/
│   ├── Analytics/
│   ├── Lifecycle/
│   ├── Team/
│   ├── Integrations/
│   └── CreditPolicy/
├── hooks/            # Custom React hooks
├── services/         # API client and service layer
├── store/            # Global state
└── utils/            # Helpers and formatters
```

---

## Tech Stack

- **React** + **Vite** — fast dev experience and optimized production builds
- **React Router** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Axios** — API communication

---

## Related

- [DealLens API](https://github.com/your-org/deallens-api) — Backend service this client connects to
- [LoanTrack iOS App](https://saadvarg.github.io/LoanTrackWeb/) — Mobile companion for loan pipeline management
- [BrokerForm Pro](https://gumroad.com/your-link) — WordPress plugin for loan application intake

---

## License

MIT © Saad El Mouataz
