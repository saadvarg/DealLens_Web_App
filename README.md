# DealLens Web App

> Enterprise equipment finance workflow — screen PDFs, review AI recommendations, manage underwriting, and configure credit policy from a single interface.

<img width="1470" height="828" alt="Screenshot 2026-06-03 at 13 34 48" src="https://github.com/user-attachments/assets/d9611a3d-5e7b-42bb-b813-25d0846f648a" />

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
<img width="800" height="300" alt="Screenshot 2026-06-03 at 13 34 48" src="https://github.com/user-attachments/assets/d9611a3d-5e7b-42bb-b813-25d0846f648a" />

<img width="800" height="300" alt="Screenshot 2026-06-03 at 13 34 25" src="https://github.com/user-attachments/assets/cc54b026-23ee-443b-ba56-d53b4d0706c4" />

<img width="800" height="300" alt="Screenshot 2026-06-03 at 13 34 12" src="https://github.com/user-attachments/assets/dbcd7d70-d5e9-4569-91ab-5d5b17370621" />

<img width="800" height="300" alt="Screenshot 2026-06-03 at 13 33 53" src="https://github.com/user-attachments/assets/bd98ee43-cf50-408a-b656-028d2de4d51e" />

<img width="800" height="300" alt="Screenshot 2026-06-03 at 13 26 00" src="https://github.com/user-attachments/assets/2739207d-5f39-4e05-aa48-fa97f5056575" />

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
<img width="500" height="250" alt="Screenshot 2026-06-03 at 13 34 48" src="https://github.com/user-attachments/assets/3ca5aa7e-546d-48d0-b0b1-487b2723874e" />

### PDF Screening
Upload and screen financial PDFs with structured borrower and equipment metadata. AI extracts key signals and surfaces a recommendation for underwriter review.

<img width="281" height="701" alt="Screenshot 2026-06-03 at 13 53 52" src="https://github.com/user-attachments/assets/2963ec45-ca5e-49f3-981d-745404d33713" />

### Deal Queue & Detail
Searchable, filterable deal queue. Click into any deal for full detail — AI report, status history, document attachments, and one-click status changes.

<img width="500" height="250" alt="Screenshot 2026-06-03 at 13 34 12" src="https://github.com/user-attachments/assets/3a004e6b-4640-4f8d-a0d4-62c2f93fd548" />


### Report Export
Export deal reports in structured format for audit trails, compliance, or external review.

### Analytics View
Track team throughput, approval rates, and pipeline velocity over time.

<img width="500" height="250" alt="Screenshot 2026-06-03 at 13 34 25" src="https://github.com/user-attachments/assets/eb2c5a49-00e8-46f3-8563-c4dcbf42ccfc" />


### Lifecycle Tracking
Visual lifecycle stages from application submission through close or pass.

### Team & Integrations
Manage team members, roles, and third-party integrations from the settings panel.

### Credit Policy Configuration
Define and update credit policy rules that feed into AI screening logic — without touching code.

<img width="500" height="250" alt="Screenshot 2026-06-03 at 13 55 46" src="https://github.com/user-attachments/assets/21a9ec34-44d0-4a24-8769-ef347293d019" />


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

- [DealLens API](https://github.com/saadvarg/DealLens_WP_Plugin) — Backend service this client connects to
- [LoanTrack iOS App](https://saadvarg.github.io/LoanTrackWeb/) — Mobile companion for loan pipeline management
- [BrokerForm Pro](https://saadventure2608.gumroad.com/l/qgumhr) — WordPress plugin for loan application intake

---

## License

MIT © Saad El Mouataz
