# TQMS Pulse

A modern frontend rebuild of the Transport Queue Management System (TQMS) —
the weighbridge and checkpoint workflow used by the Nepal Truck Transport
Entrepreneurs' Federation to issue receipts, track journeys across three
checkpoints, and produce operational reports.

Built as the submission for the technical assessment: **frontend development
with a mock backend**.

- **Live preview:** _<add your Vercel URL here after deploying>_
- **Source:** _<add your GitHub URL here>_
- **Stack:** Next.js 16.4.5 · React 19.2 · TypeScript · Tailwind CSS ·
  TanStack Query + Table · React Hook Form · Zod · shadcn-style primitives

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Quick start](#2-quick-start)
3. [Technology stack](#3-technology-stack)
4. [Project structure](#4-project-structure)
5. [Environment configuration](#5-environment-configuration)
6. [Available scripts](#6-available-scripts)
7. [Sample credentials](#7-sample-credentials)
8. [Architecture](#8-architecture)
9. [Mock backend](#9-mock-backend)
10. [State management](#10-state-management)
11. [Accessibility](#11-accessibility)
12. [Performance](#12-performance)
13. [Testing](#13-testing)
14. [Known limitations](#14-known-limitations)
15. [Future integration approach](#15-future-integration-approach)
16. [Deployment](#16-deployment)
17. [Documentation index](#17-documentation-index)

---

## 1. Project overview

TQMS is the operational system behind a network of truck weigh-stations. Every
vehicle entering the system is issued a **weighbridge receipt (रसिद)**, queued
for a route, checked in at a starting checkpoint, weighed at up to three
checkpoints, and finally reported on. The receipt is the system of record;
queue cards and reports are views of it.

The rebuild has three goals, in priority order:

1. **Functional parity** with the source system at
   `https://tqms.bitspanda.com` — every sidebar item, business rule, and
   workflow that exists there exists here.
2. **Enterprise-grade UX** — replacing native `alert()`/`confirm()` with
   accessible dialogs and toasts, adding loading, empty, and error states,
   making every list searchable, filterable, sortable, and paginated, and
   giving every form inline validation.
3. **Architectural quality** — a feature-based frontend that is legible,
   testable, and can swap its mock backend for the real API without touching
   a single presentation component.

What changed versus the source system is documented in
[`docs/system-analysis.md`](docs/system-analysis.md) §5 and §9 — a
31-item improvement register that reads as a diff between the two versions.

**Scope of this rebuild:** nine feature modules covering the Checkpoints
directory, the live queue, the receipt-issuing transaction, three vehicle
registries, two reports, a QR generator, and the operator's profile. Every
screen in the source sidebar is implemented.

---

## 2. Quick start

**Prerequisites:** Node.js 20.9 or later, and a package manager (`npm`,
`pnpm`, or `yarn`). Node 20 LTS is the safest choice for Next 16.

```bash
# 1. Clone
git clone <your-repo-url> tqms-pulse
cd tqms-pulse

# 2. Install
npm install

# 3. Create local environment
cp .env.example .env.local
# Default values already match the mock; no edits needed for local dev.

# 4. Run
npm run dev