# TQMS-Pulse

> A modern, frontend-focused rebuild of the Transport Queue Management System (TQMS) for the Nepal Truck Transport Entrepreneurs' Federation. This application is a complete, feature-based workflow with a high-fidelity mock backend, built with Next.js 16 and React 19.


##  Table of Contents

- [Overview](#-overview)
- [Key Workflows](#-key-workflows)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Mock API Documentation](#-mock-api-documentation)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [Future Integration](#-future-integration)
- [Project Documents](#-project-documents)

##  Overview

TQMS-Pulse is a complete frontend rebuild of the legacy TQMS application. It solves three core problems for the checkpoint operator:

1.  **Receipt Issuance:** Creating a weighbridge receipt (`रसिद`) and enqueueing a vehicle is a single, validated transaction.
2.  **Queue Management:** Live monitoring of the **Pending** and **Existing** queues, with status-based actions like `Check In` and `End Journey`.
3.  **Real-time Insights:** The dashboard can be configured to poll for new pending receipts, providing a near real-time view of the operation.

The application is built entirely with a feature-based architecture, making it scalable and maintainable. It uses a realistic mock backend that persists data to `localStorage`, allowing for complete end-to-end testing without a server.

##  Key Workflows

The application models the complete journey of a goods vehicle:
`Receipt Issued` → `Pending Queue` → `Check In` → `In Job` → `End Journey` → `Payment Pending`.

Each step is a validated, user-facing interaction with its own screen, forms, and business rules.

##  Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React framework for routing, server components, and mock API routes |
| **Language** | TypeScript | Static typing for robustness and developer experience |
| **UI** | Tailwind CSS, shadcn/ui, Radix UI | Utility-first styling and accessible headless primitives |
| **Forms** | React Hook Form, Zod | Performant, uncontrolled forms with schema-based validation |
| **Server State** | TanStack Query (v5) | Caching, background refetching, and request de-duplication |
| **Tables** | TanStack Table | Headless UI for building powerful tables and datagrids |
| **Dates** | `nepali-date-converter` | Handling Bikram Sambat (BS) calendar dates |
| **Icons** | Lucide React | SVG icon library |

##  Architecture

The project follows a **feature-based architecture**, keeping domain logic separate from presentation.

src/  
├── app/ # Routes and API route handlers (mock backend)  
├── components/ # Shared UI primitives (Button, Input, DataTable, etc.)  
├── features/ # Domain modules (auth, queue, vehicles, etc.)  
│ ├── queue/  
│ │ ├── api.ts  
│ │ ├── hooks/  
│ │ ├── components/  
│ │ └── types.ts  
│ └── ...  
├── lib/ # Core utilities (fetcher, BS date helpers, query client)  
├── mocks/ # Mock data (seed files) and backend logic (db.ts, helpers)  
├── providers/ # React context providers (AppProviders, ToastProvider)  
└── types/ # Global TypeScript interfaces  


*   **Server Components (`src/app`):** Handle routing, metadata, and initial data fetching. They compose feature modules.
*   **Feature Modules (`src/features`):** Encapsulate all logic for a domain. They own their API calls, hooks, and domain-specific components.
*   **Shared Components (`src/components`):** Purely presentational, reusable components like `<DataTable>` or `<StatusBadge>`.
*   **Mock Backend (`src/app/api`):** Route handlers that simulate a real API. Data is persisted to `localStorage` for a realistic session experience.

##  Getting Started

### Prerequisites
- Node.js 20.9+ (`nvm use 20` is recommended)
- npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tqms-pulse.git
    cd tqms-pulse

2. **Install dependencies:**

    ```bash
    npm install

3. **Set up environment variables:**  
    Copy the example file and ensure the mock API base URL is set.

    ```bash
    cp .env.example .env.local        

    env
    # .env.local
    NEXT_PUBLIC_API_BASE_URL=/api
    NEXT_PUBLIC_APP_NAME=TQMS-Pulse

4. **Run the development server:**

    ```bash
    npm run dev
    Open the application:
    Navigate to http://localhost:3000.

**Sample Credentials**

        Username: checkpoint

        Password: checkpoint123

##  Mock API Documentation
The mock backend is built with Next.js Route Handlers and serves data from an in-memory store (src/mocks/db.ts) that persists to localStorage. This allows for complete CRUD functionality without an external database.

## Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/lookup/:type` | Fetches a list of options for dropdowns (e.g., states, districts, checkpoints). |
| POST | `/api/auth/login` | Authenticates a user and sets an HttpOnly session cookie. |
| GET | `/api/check-users` | Fetches a paginated list of check users. Supports search, sort, and pagination. |
| POST | `/api/check-users` | Creates a new check user. |
| GET | `/api/queue` | Fetches queue entries, filtered by status and other criteria. |
| POST | `/api/queue` | Issues a receipt and creates a new pending queue entry. |
| POST | `/api/queue/:id/check-in` | Checks in a pending queue entry, moving it to "In Job". |
| POST | `/api/queue/:id/end-journey` | Ends an in-job journey, moving it to "Payment Pending". |
| GET | `/api/reports/checkpoint-entry` | Fetches aggregate report data. |
| GET | `/api/reports/detail-entry` | Fetches line-item report data. |
| GET | `/api/reports/detail-entry/export` | Streams a CSV export of the detail report. |

## Testing Error States

You can force any mock endpoint to return a `500 Internal Server Error` by appending `?fail=1` to its URL.

**Example:**

  `http
  GET /api/check-users?fail=1 `

## Deployment

The application is designed for zero-configuration deployment on Vercel. A `vercel.json` file is included with the necessary build and rewrite configurations.

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Vercel will automatically detect the Next.js framework and apply the correct build settings.
4. Set the environment variable `NEXT_PUBLIC_API_BASE_URL` to `/api` in the Vercel project settings.
5. Deploy. Every subsequent push to the `main` branch will trigger a new production deployment.

## Known Limitations

This project is an assessment submission and uses a mock backend. The following limitations are intentional and documented:

- **No File Uploads:** The `FileField` component captures file selections in the form state, but the mock API does not persist them to a filesystem.

- **Fixed CP1–CP3 Journey:** The journey is designed with exactly three checkpoints, mirroring the source system's constraint. The data model does not support a variable number of checkpoints.

- **Other's Vehicle Creation:** The create form for Other's Vehicle has a single field (`Others Type`), matching the source system. The `formatedNo` and `numberType` are derived by the mock backend.

- **Non-Populated Columns:** The Linked Owner and Is Assigned columns in the Vehicle Owner table are rendered for parity but are not populated by the mock data.

- **Password Change:** The mock password change endpoint updates an in-memory variable. The change is lost when the server restarts.

## Future Integration

The transition to a real backend is designed to be straightforward:

1. **Update the API Base URL:** Change the `NEXT_PUBLIC_API_BASE_URL` environment variable to point to your production API.
2. **Remove Mock Routes:** Delete the `src/app/api/*` directory.
3. **Verify API Contract:** Ensure your real backend's endpoints and response envelopes (`{ data, meta }`) match those documented in this README.

No UI components need to be changed. All HTTP logic is isolated in the `api.ts` files within each feature module.

## Project Documents

Detailed documentation is available in the `docs/` directory:

- **System Analysis:** A full breakdown of the legacy TQMS application, including business logic and a UX improvement register.
- **Glossary:** A Nepali-to-English dictionary of domain terms.
- **Mock API Contract:** A detailed specification of every mock API endpoint.
- **Architecture Decisions:** ADRs explaining the critical technical choices.
