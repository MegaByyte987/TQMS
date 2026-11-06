# System Analysis — TQMS (Transport Queue Management System)

**Project:** TQMS-Pulse (frontend rebuild)
**Source application:** https://tqms.bitspanda.com
**Document type:** System analysis + implementation decisions
**Deliverable:** Assessment section 2 (System analysis) + section 7 item 5 (System analysis documentation)

> **Assessment context.** This document analyses the existing TQMS application as observed
> through a read-only Checkpoint User account, and records the implementation decisions
> taken for the TQMS-Pulse rebuild. No production data was created, modified, or submitted
> during analysis. The account was used strictly for observation.

---

## Table of contents

1. Application overview
2. Domain glossary (Nepali ⇄ English)
3. Users and roles
4. Module map
5. Core business workflow
6. Navigation and application shell
7. Module-by-module analysis
   - 7.1 Checkpoints → Check User
   - 7.2 Checkpoints → Narration
   - 7.3 Queue (dashboard)
   - 7.4 Add New Queue
   - 7.5 Vehicle → Vehicle Owner
   - 7.6 Vehicle → Vehicles
   - 7.7 Vehicle → Other's Vehicle
   - 7.8 Reports → Checkpoint Entry
   - 7.9 Reports → Detail Entry Report
   - 7.10 Generate QR
8. Cross-cutting observations
9. Consolidated UX improvement register
10. Design constraints and known limitations
11. Implementation decisions for TQMS-Pulse
12. Appendix A — Data model
13. Appendix B — Mock API sketch
14. Appendix C — Feature folder mapping

---

## 1. Application overview

**TQMS** is an enterprise web application used by the Nepal Truck Transport Entrepreneurs'
Federation (नेपाल ट्रक यातायात व्यवसायी महासंघ) to manage the lifecycle of goods vehicles
across a network of weigh-stations and checkpoints.

Every vehicle entering the system is issued a **weighbridge receipt (रसिद)**, queued for a
route, checked in at a starting point, weighed at up to three checkpoints (CP1 → CP2 → CP3),
billed, and finally reported on. The application is therefore not a generic queue manager —
it is a **receipt-issuing operational system** where the receipt is the primary record and
the queue card is a live view of it.

### 1.1 What the application does, in one paragraph

A Vehicle Owner is registered and their vehicles are registered against them. A checkpoint
operator uses **Add New Queue** to issue a receipt for a vehicle travelling from a start
point to a destination, recording gross weight, goods, and narration. That receipt places
the vehicle in a **pending queue**. When the journey begins, the operator **checks in** the
vehicle (assigning a queue number, entry date, and last checkpoint). The vehicle is then
weighed at up to three checkpoints, each producing a weight and a bill number. On
completion the operator **ends the journey**, and the transaction appears in the
**Checkpoint Entry** and **Detail Entry** reports.

### 1.2 Why this analysis matters for the rebuild

Three facts drive every implementation decision in section 11:

1. **The receipt is the system of record.** Queue numbers, entry dates, journey weights,
   checkpoint bills, and report line items all derive from it.
2. **The journey is fixed at three checkpoints.** The UI is not generalised, and neither
   should the rebuild be.
3. **The calendar is Bikram Sambat only.** No Gregorian toggle exists or is expected.

---

## 2. Domain glossary (Nepali ⇄ English)

The application mixes English UI labels with Nepali domain terms. Consistency across the
rebuild depends on a shared glossary.

| Nepali | English | Role in the system |
|---|---|---|
| नेपाल ट्रक यातायात व्यवसायी महासंघ | Nepal Truck Transport Entrepreneurs' Federation | Organisation header printed on every receipt |
| पान नं | PAN No. | Tax identifier of the federation (static on receipt) |
| फोन नं | Phone No. | Static contact numbers on receipt |
| रसिद नं | Receipt No. | Primary identifier of a queue entry |
| मिति | Date | Bikram Sambat calendar date |
| समय | Time | 12-hour clock with AM/PM |
| तौलस्थान | Weighing station | Should be a checkpoint; currently free text |
| सवारी नं | Vehicle No. | Plate / formatted vehicle number |
| समान | Goods | Same as *Load Details* |
| विवरण | Description | Same as *Narration* |
| तौल | Weight (kg) | Gross weight at check-in |
| रकम (रु.) | Amount (Rs.) | Currency column on the receipt fee table |
| काटा शुल्क | Weighing-slip fee | One fee line, currently Rs. 50 |
| जम्मा शुल्क | Total fee | Derived sum of fee lines |
| जम्मा | Total | Generic total label |
| स्थानीयसंघ (Sthaniyasangh) | Local Association | Association a vehicle is registered under |
| स्थानीय (Sthaniya) | Local | Category of owner or vehicle |
| Loadboard sthaniya | Loadboard (local) | Receipt category shown on the receipt |

**Naming inconsistency to preserve for traceability:** the *Vehicles* table uses
`Plate No`, while *Other's Vehicle* uses `Formated No`. Both are retained verbatim in the
rebuild so that a user moving between the old and new systems can cross-reference records.

---

## 3. Users and roles

The only role observable from the supplied account is **Checkpoint User**. The profile menu
exposes *My Profile*, *Change Password*, and *Logout*. The presence of a profile and a
password-change flow implies an authenticated session, but **no role-based UI branching** was
observed: every menu item was visible.

**Implication for the rebuild:** the mock backend models a single role (Checkpoint User) with
an HttpOnly session cookie. Role-based rendering is intentionally out of scope and noted as a
future extension.

---

## 4. Module map

```
TQMS
├── Checkpoints
│   ├── Check User          → staff directory (create / edit / delete-with-confirm)
│   └── Narration           → seeded lookup list (edit only, no create)
├── Queue                   → live dashboard: pending + existing jobs
├── Add New Queue           → form + live Nepali receipt preview
├── Vehicle
│   ├── Vehicle Owner       → owners and companies (Details / Edit)
│   ├── Vehicles            → registered vehicles (Details / Edit)
│   └── Other's Vehicle     → non-registered vehicles (Details / Edit)
├── Reports
│   ├── Checkpoint Entry    → daily summary per checkpoint user
│   └── Detail Entry Report → line-item report, Print + Export Excel
└── Generate QR             → single QR image + download
```

---

## 5. Core business workflow

The full lifecycle, derived from screen observations:

```
Vehicle Owner registered
        │
        ▼
Vehicle registered  (linked to owner + Sthaniyasangh)
        │
        ▼
Add New Queue  ──►  Receipt issued (रसिद नं, fee lines, total)
        │
        ▼
Pending Queue  ──►  Check In  ──►  In Job
        │
        ▼
Journey through CP1 → CP2 → CP3
   (each checkpoint records a weight and a bill number)
        │
        ▼
End Journey (confirmed dialog)
        │
        ▼
Payment Pending  ──►  Closed
        │
        ▼
Reports
   ├── Checkpoint Entry  (aggregate per checkpoint user)
   └── Detail Entry      (line items, one row per journey event)
```

### 5.1 Key workflow insight

The *Add New Queue* screen is not merely a form — it is a **receipt-issuing transaction**.
The Nepali block rendered alongside the form is a live preview of the receipt that will be
produced. Understanding this collapses several apparent inconsistencies:

- The **Checkpoint Entry report's `Total Vehicle`** is a count of receipts.
- The **Checkpoint Entry report's `Total Amount`** is the sum of `जम्मा शुल्क`.
- The **Detail Entry report's `Receipt No`** column and the **`Bill No` filter** both
  reference the same identifier — the receipt number.
- The **journey table's `CP1 BillNo` / `CP2 BillNo` / `CP3 BillNo`** are the receipt numbers
  issued at each checkpoint, not separate bills.
- The **`Checkpoint Weight (Kg)`** on the check-in summary is the weight recorded on the
  receipt at issuance, later reconciled with per-checkpoint weights.

---

## 6. Navigation and application shell

| Element | Observed behaviour |
|---|---|
| Brand | "TQMS" with an adjacent collapse button; clicking collapses the sidebar to an icon-only rail |
| Sidebar | Parent items expand a dropdown of sub-items on click; hover highlights the item |
| Active state | Highlighted text on the active route only |
| Top-right | Profile button → menu with My Profile, Change Password, Logout |
| Breadcrumbs | **Not present.** Navigation state is conveyed only by the active sidebar item |
| Responsive — small screens | Sidebar hidden; revealed by a hamburger button positioned above the sidebar |
| Responsive — larger phones | Sidebar remains visible as an icon-only rail; same expand button opens the full sidebar |
| Persistence | Collapsed/expanded state is **not persisted**; resets on reload |

### 6.1 Shell improvements planned

1. Introduce **breadcrumbs** derived from the active route segments, rendered in the topbar.
2. Persist sidebar collapsed state in `localStorage`.
3. Add focus management for the mobile sidebar drawer (Esc closes, focus trapped).
4. Keep the profile menu items unchanged for parity.

---

## 7. Module-by-module analysis

### 7.1 Checkpoints → Check User

**Purpose.** Manage the staff accounts that operate a checkpoint.

| Aspect | Observed behaviour |
|---|---|
| Layout | Single table with a search input above it |
| Columns | `S.N`, `Name`, `Address`, `Contact`, `Status`, `Edit`, `Delete` |
| Search | By **name** only |
| Pagination | Present; page-size controls become visible with sufficient data |
| Sort | Not observed |
| Row actions | **Edit** (icon) and **Delete** (icon); no explicit View |
| Delete confirmation | **Yes** — a native confirmation appears before deletion |
| Status | Binary, rendered as a **coloured dot with no text label** |

**Create / Edit form fields.**

| Field | Type | Required |
|---|---|---|
| Staff Name | text | Yes |
| State | select | Yes |
| District | select (cascades from State) | Yes |
| Street Address | text | No |
| Mobile Number | tel | Yes |
| Email | email | No |

**Issues observed.**

- Binary status uses colour alone, which fails WCAG 1.4.1 (colour is not the sole means of
  conveying information).
- `S.N` is a display ordinal, not a stable identifier — it should not be used as a React key
  or a route parameter.
- No View action: users must open Edit to inspect a record.
- Delete confirmation is native `confirm()` — functional but visually inconsistent with the
  rest of the interface.
- No inline validation; error messaging mechanism unknown.

**Decisions for the rebuild.**

| Issue | Decision |
|---|---|
| Colour-only status | `<StatusBadge>` renders text + colour + `aria-label` |
| No View action | Add a read-only **Details** drawer before Edit |
| Native `confirm()` | Replace with a styled `<ConfirmDialog>` (destructive variant) that names the record |
| No inline validation | React Hook Form + Zod with field-level messages |
| `S.N` as key | Use UUID `id` for keys and routes; keep `S.N` as display only |

---

### 7.2 Checkpoints → Narration

**Purpose.** A managed list of reusable narration strings consumed by *Add New Queue*.

| Aspect | Observed behaviour |
|---|---|
| Layout | Table with `S.N`, `Narration`, `Edit` icon |
| Seed data | A single dev artefact: `"test narration"` |
| Create | **Not available anywhere in the application** (verified) |
| Delete | Not available |
| Pagination / search | Not observed |

**Issues observed.**

- No create path exists in any screen; narrations are effectively an administrator-seeded
  lookup.
- The only row is a development placeholder (`"test narration"`), indicating that the
  production dataset is either empty or seeded externally.

**Decisions for the rebuild.**

| Issue | Decision |
|---|---|
| No create path | Treat Narration as an **admin-seeded lookup**, not a CRUD module. The UI supports **edit only**. This absence is intentional and documented as a known limitation. |
| Dev seed data | Replace with 6 realistic narration strings (e.g., "Loading gravel at quarry", "Returning empty container") |

---

### 7.3 Queue (dashboard)

**Purpose.** Operational dashboard where checkpoint staff monitor the pending queue and the
active jobs.

#### 7.3.1 Layout

Two stacked sections on one page:

**(a) Pending Queue** — card grid
- 4 cards per horizontal page
- Filter: by **vehicle** only
- **No auto-refresh** — critical gap for a live operational screen

**(b) Existing Queue** — card grid
- Segmented tabs: *All · In Job · In Queue · Unregistered · Payment Pending*
- Filter button on the right opens: *Vehicle Name · Card Type · Vehicle Type*
- Each card exposes three actions: **Check In · View · End Journey**

#### 7.3.2 Check In — detail panel

Clicking **Check In** opens a detail panel with the following 15 fields:

> Queue Status · Queue Number · Entry Date · Last CheckPoint · Route · Transport Company ·
> Load Details · Checkpoint Weight (Kg) · Vehicle Status · Type · Is Registered ·
> Card Registered / Sthaniya · Owner Name · Driver Phone

#### 7.3.3 View — journey detail table

Clicking **View** opens the per-checkpoint journey table, **fixed at CP1–CP3**:

> `S.N` · `Entry Date` · `From` · `To` · `CP1 Wt.(kg)` · `CP2 Wt.(kg)` · `CP3 Wt.(kg)` ·
> `CP 1` · `CP1 BillNo` · `CP 2` · `CP2 BillNo` · `CP 3` · `CP3`

The fixed column count is a design constraint of the source system, verified across routes.

#### 7.3.4 End Journey

Clicking **End Journey** opens a native confirm dialog with the text *"Are you sure?"* and
confirm/cancel options.

#### 7.3.5 Business rules inferred

- A vehicle in *Pending* is not yet "checked in"; checking in creates the active job with a
  queue number and entry date.
- *In Queue* = waiting; *In Job* = actively traveling; *Payment Pending* = journey complete
  but bill unpaid; *Unregistered* = vehicle recorded in *Other's Vehicle*.
- The journey is modelled as an ordered sequence of up to **3 checkpoints**, each
  contributing a weight and a bill number.
- The `Card Type` and `Card Registered` fields imply an RFID or smart-card subsystem that is
  not explained anywhere in the UI.

#### 7.3.6 Issues observed

- **No auto-refresh** on a screen whose purpose is real-time queue monitoring.
- Card grid paginated at 4-per-page is inefficient for scanning a long queue.
- *End Journey* confirmation text ("Are you sure?") is too vague for a state-final action.
- *Check In* and *View* both surface journey information with no visual cue distinguishing
  them — users cannot predict what each will show.
- Dates use mixed display formats despite being Bikram Sambat throughout.
- Receipt is not reachable from the queue card, although it is the underlying record.

#### 7.3.7 Decisions for the rebuild

| Issue | Decision |
|---|---|
| No auto-refresh | TanStack Query `refetchInterval: 15_000` + manual refresh button + "last updated" timestamp |
| 4-per-page pagination | Add a **List / Grid toggle**; list view paginated at 25 rows |
| Vague *End Journey* confirm | `<ConfirmDialog>` restates vehicle, route, last checkpoint, and totals before confirming |
| *Check In* vs *View* ambiguity | Rename to **Check In** (write) and **Journey Details** (read); distinct icons |
| Receipt not reachable | Add **Reprint Receipt** action on both the check-in panel and the card menu |
| Fixed CP1–CP3 constraint | Preserved; documented as explicit design constraint (section 10) |

---

### 7.4 Add New Queue

**Purpose.** Issue a weighbridge / loadboard receipt and enqueue the vehicle. The right
column renders a **live Nepali receipt preview** as the form is filled.

#### 7.4.1 Form fields

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| Vehicle (सवारी नं) | searchable select | Yes | — | must exist; not already in an open queue (`409` if duplicate) |
| From | select | Yes | — | must differ from To |
| To | select | Yes | — | must differ from From |
| Gross Weight (Kg) (तौल) | number | Yes | **blank** (currently `0` in source) | > 0 and ≤ 60,000 |
| Entry Date (मिति) | BS date picker | auto | today (BS) | not in the future |
| Transport Company Name | text | No | — | — |
| Load Details (समान) | text | Yes | — | — |
| Narration (विवरण) | select from Narration lookup | No | **blank** (currently `"test narration"` in source) | — |
| Driver's Phone | tel | No | — | 10 digits |

#### 7.4.2 Receipt structure (rendered live in Nepali)

```
नेपाल ट्रक यातायात व्यवसायी महासंघ              [static header]
पान नं: 852100017 · फोन नं: 01-9863333, 013-5555555

Loadboard sthaniya                                [type]
रसिद नं: INX_<BS year>_<sequence>                 [generated]
मिति: <BS date>   समय: <HH:MM AM/PM>

तौलस्थान: <checkpoint>   सवारी नं: <vehicle>
समान: <goods>   विवरण: <narration>   तौल: <kg>

────────────────────────────────────────────
विवरण               रकम (रु.)
काटा शुल्क           50
जम्मा शुल्क          50.00
```

The currently observed receipt number `INX_2026_2_3` uses the **AD** year (2026) while the
displayed date is **BS** (2083). This mixed-calendar identifier is inconsistent and must be
corrected in the rebuild.

#### 7.4.3 Issues observed

| # | Issue | Detail |
|---|---|---|
| 1 | Receipt No. mixes calendars | `INX_2026_…` uses AD year while `मिति` is BS 2083 |
| 2 | `तौलस्थान` is free text | Real data already contains a typo (`"lodbod checkpoint"`) |
| 3 | Weight defaults to `0` | A `0` value is not a valid gross weight |
| 4 | Narration defaults to `"test narration"` | A shipped dev artefact; will pollute production records |
| 5 | Fee table has one line | Structure implies multiple lines; only काटा शुल्क exists today |
| 6 | No print action | The receipt is the product of the form but cannot be printed |
| 7 | No draft/issued state | The preview is indistinguishable from an issued receipt |

#### 7.4.4 Decisions for the rebuild

| # | Issue | Decision |
|---|---|---|
| 1 | Mixed calendars | Canonical format `INX_<BS year>_<sequence>`; both display and generation use BS |
| 2 | Free-text weigh station | Convert to a **checkpoint lookup**; free text disabled in new entries |
| 3 | Weight default | Blank field; Zod enforces `> 0` and `≤ 60,000` |
| 4 | Narration dev default | Blank; placeholder text only |
| 5 | Single fee line | Model as `FeeLine[]` with add/remove in the UI; total derived |
| 6 | No print | Add **Print receipt** with 80 mm thermal CSS; also add **Reprint** from Queue card |
| 7 | No state distinction | Show `Draft → Issued` state; lock fields after issuance |

---

### 7.5 Vehicle → Vehicle Owner

**Purpose.** Register and manage vehicle owners and companies.

#### 7.5.1 List

| Aspect | Observed behaviour |
|---|---|
| Columns | `S.N`, `Name/Company`, `Address`, `Phone No.`, `Linked Owner`, `IsAssigned` |
| Row actions | **Details** and **Edit** (no delete) |
| `Linked Owner` column | Empty on every row |
| `IsAssigned` column | Empty on every row; the option set is *Assigned* / *Not Assigned* |

#### 7.5.2 Create form — full field map

The form is organised into three sections.

**Section 1 — Enter Vehicle Owner Details**

| Field | Type | Required |
|---|---|---|
| Name | text | Yes |
| Logo | file upload | No |
| State | select | Yes |
| District | select (cascades from State) | Yes |
| Local Level | text | No |
| Street Address | text | No |
| Email | email | No |
| PAN Number | text | No |
| Phone Number | tel | Yes |
| Is Individual | toggle | No |

**Section 2 — Enter Contact Details** (conditionally shown when `Is Individual = false`)

| Field | Type |
|---|---|
| Contact Person Name | text |
| Contact Email | email |
| Contact Number | tel |

**Section 3 — Enter Registration Details**

| Field | Type |
|---|---|
| Registration Number | text |
| Registration Document | file upload |

#### 7.5.3 Issues observed

- `Is Individual` is a boolean whose downstream effect (revealing Contact Details) is not
  explained anywhere in the UI.
- `Linked Owner` and `IsAssigned` are unpopulated on every row; their semantics are
  undocumented.
- File uploads (Logo, Registration Document) show no preview, no size/type constraints, and
  no upload progress.
- No Delete action — consistent with a preserve-history policy.

#### 7.5.4 Decisions for the rebuild

| Issue | Decision |
|---|---|
| `Is Individual` unclear | Helper text under the toggle explaining the effect; conditionally reveal Contact Details |
| `Linked Owner`, `IsAssigned` empty | Render both columns but mark *(not populated)*; exclude from filter UI |
| File uploads | Enforce max size + MIME type; show preview and upload progress |
| No delete | Omit delete — matches existing system |

---

### 7.6 Vehicle → Vehicles

**Purpose.** Register and manage vehicles.

#### 7.6.1 List

| Aspect | Observed behaviour |
|---|---|
| Columns | `S.N`, `Plate No`, `Lot No`, `Vehicle Number`, `Vehicle Type` |
| Row actions | **Details** and **Edit** |

#### 7.6.2 Create form

| Field | Type | Required |
|---|---|---|
| Sthaniyasangh | select | Yes |
| Vehicle Owner | select | Yes |
| Vehicle Type | select | Yes |
| Plate Color | select | Yes |
| Plate Type | select | Yes |
| Engine Number | text | No |
| Chassis Number | text | No |
| Company Name | text | No |
| Model No. | text | No |

#### 7.6.3 Issues observed

- Jargon (`Sthaniyasangh`, `Plate Type`, `Lot No`) is unexplained.
- No plate-format validation despite Nepali plate conventions existing.
- Vehicle Owner is a single select with no history; changing it silently reassigns ownership.

#### 7.6.4 Decisions for the rebuild

| Issue | Decision |
|---|---|
| Unexplained jargon | Inline tooltip with glossary excerpt |
| No plate validation | Zod regex for Nepali plate format; free-text fallback for legacy records |
| No owner history | Out of scope; documented as future work |

---

### 7.7 Vehicle → Other's Vehicle

**Purpose.** Register vehicles that are not part of the registered fleet (third-party,
temporary). These surface in the Queue as "Unregistered".

#### 7.7.1 List

| Aspect | Observed behaviour |
|---|---|
| Columns | `S.N`, `Formated No`, `Number Type`, `Plate Type` |
| Row actions | **Details** and **Edit** |

#### 7.7.2 Create form

| Field | Type | Required |
|---|---|---|
| Others Type | select | Yes |

**Verified:** the create form contains only one field. The table's other two columns
(`Formated No`, `Number Type`) are not captured by the form.

#### 7.7.3 Issues observed

- The single-field create form is almost certainly incomplete — a vehicle needs at minimum a
  formatted number, yet the table displays three columns.
- The naming `Formated No` is inconsistent with `Plate No` on the registered-Vehicles module.

#### 7.7.4 Decisions for the rebuild

| Issue | Decision |
|---|---|
| 1-field create form | Build as designed (parity). The mock derives `Formated No` and `Number Type` from `Others Type` for display purposes. Documented as known limitation. |
| Naming inconsistency | Retained verbatim for traceability; noted in glossary |

---

### 7.8 Reports → Checkpoint Entry

**Purpose.** Daily summary of activity per checkpoint user.

#### 7.8.1 Filters

| Filter | Type |
|---|---|
| Checkpoint / User Name | select |
| Start Date | BS date picker |
| End Date | BS date picker |

#### 7.8.2 Table columns

`S.N` · `Sthaniya Sangh` · `Checkpoint` · `Checkpoint User` · `Entry Date` ·
`Total Vehicle` · `Total Amount`

#### 7.8.3 Issues observed

- Start and End dates default to identical values (today/today), silently producing an empty
  report if the user does not widen the range.
- No Print or Export on this report, while the sibling Detail Entry report has both —
  inconsistent.
- `Total Vehicle` and `Total Amount` are derived aggregates but the source is undocumented.

#### 7.8.4 Decisions for the rebuild

| Issue | Decision |
|---|---|
| Silent empty result | Explicit empty state: "No activity in this range. Try widening your dates." |
| No export | Standardise Print + Export Excel on both reports |
| Undocumented aggregates | Document: `Total Vehicle` = receipt count; `Total Amount` = sum of `जम्मा शुल्क` |

---

### 7.9 Reports → Detail Entry Report

**Purpose.** Line-item report of every journey event, with export.

#### 7.9.1 Filters

| Filter | Type |
|---|---|
| Start Date | BS date picker |
| End Date | BS date picker |
| Vehicle No | select |
| Goods Details | select |
| Bill No | select |

#### 7.9.2 Export actions

**Print** and **Export Excel**, both positioned above the table.

#### 7.9.3 Table columns

`S.N` · `Date & Time` · `Receipt No` · `Vehicle No` · `Vehicle Type` ·
`Checkpoint Name` · `From–To (Route)` · `Gross Weight (in kg)` · `Material` · `Remarks`

#### 7.9.4 Issues observed

- Only this report supports Print and Export; the sibling Checkpoint Entry report does not.
- Vehicle No, Goods, and Bill No filters are plain selects and will not scale to thousands of
  options.
- The `Bill No` filter is undocumented as being the same identifier as `Receipt No`.

#### 7.9.5 Decisions for the rebuild

| Issue | Decision |
|---|---|
| Asymmetric export | Both reports get Print + Export Excel in the table header |
| Plain selects | Convert Vehicle, Goods, Bill No to searchable async comboboxes |
| `Bill No` == `Receipt No` | Surface in a UI tooltip; map to `receiptNo` in the API |
| Pagination | Server-paginated; export ignores pagination (full result set) |

---

### 7.10 Generate QR

**Purpose.** Produce a downloadable QR code.

#### 7.10.1 Observed

A single page: a QR image with a **Download** button beneath it. No controls to configure
what the QR encodes.

#### 7.10.2 Issues observed

- No explanation of what the QR represents or its scope or expiry.
- No regenerate, no copy-to-clipboard, no print-friendly layout.

#### 7.10.3 Decisions for the rebuild

| Issue | Decision |
|---|---|
| No context | Caption stating scope (currently "checkpoint token") |
| No regenerate / copy / print | Add Regenerate, Copy, and Print actions |

---

## 8. Cross-cutting observations

| Concern | Observed behaviour | Decision for rebuild |
|---|---|---|
| Styling | Bare HTML with minimal CSS | shadcn/ui + Tailwind design tokens |
| Feedback | Native `alert()` / `confirm()` only | Toast provider + accessible `<ConfirmDialog>` |
| Loading | None observed | Skeletons per table/card; disabled + spinner on buttons during mutations |
| Empty | None observed | `<EmptyState>` with contextual hints per screen |
| Error | None in UI | `<ErrorState>` with retry; field-level and form-level validation |
| Validation | Not inline | React Hook Form + Zod per feature |
| Dates | Bikram Sambat only, no format hint | BS-only picker; no Gregorian toggle |
| Keyboard | Not observable from analysis | All modals focus-trapped; Esc closes; forms tab-ordered |
| Localisation | English labels + Nepali domain terms | Glossary + consistent terminology across the rebuild |
| Sidebar state | Not persisted | Persist collapsed state in `localStorage` |
| Breadcrumbs | Not present | Derived from route segments |
| Roles | Single role only (Checkpoint User) | Single-role session; role rendering out of scope |
| Receipt printing | Not available | Thermal 80 mm print + reprint from Queue |

---

## 9. Consolidated UX improvement register

| # | Screen | Issue | Improvement |
|---|---|---|---|
| 1 | Global | Bare HTML, no design system | shadcn/ui + Tailwind tokens |
| 2 | Global | `alert()` / `confirm()` used everywhere | Toast + `<ConfirmDialog>` |
| 3 | Global | No loading, empty, or error states | Skeleton · EmptyState · ErrorState |
| 4 | Global | No breadcrumbs | Breadcrumbs from route segments |
| 5 | Global | Sidebar state resets on reload | Persist in localStorage |
| 6 | Check User | Colour-only status | Text + colour + aria-label badge |
| 7 | Check User | No View action | Details drawer |
| 8 | Check User | Native delete confirm | Styled confirm that names the record |
| 9 | Narration | No create path (verified) | Intentional; documented as known limitation |
| 10 | Narration | Dev seed `"test narration"` shipped | 6 realistic seed strings |
| 11 | Queue | No auto-refresh on live operational screen | `refetchInterval: 15s` + manual refresh |
| 12 | Queue | 4-cards-per-page hides long queues | List/Grid toggle; list at 25 per page |
| 13 | Queue | Vague "Are you sure?" on End Journey | Confirm restates vehicle, route, totals |
| 14 | Queue | Check In vs View ambiguity | Rename + distinct icons |
| 15 | Queue | Receipt not reachable from card | Reprint Receipt action |
| 16 | Add New Queue | Narration prefilled `"test narration"` | Blank; placeholder only |
| 17 | Add New Queue | Weight defaults to `0` | Blank; `> 0` validated |
| 18 | Add New Queue | Receipt No. mixes AD year with BS date | Canonical `INX_<BS>_<seq>` |
| 19 | Add New Queue | `तौलस्थान` free text (typo in real data) | Checkpoint lookup |
| 20 | Add New Queue | Single fee line despite table layout | Multi-line `FeeLine[]`, derived total |
| 21 | Add New Queue | No print | 80 mm thermal print + reprint |
| 22 | Vehicle Owner | `Is Individual` effect invisible | Helper text + conditional reveal |
| 23 | Vehicle Owner | `Linked Owner` / `IsAssigned` unpopulated | Render, mark *(not populated)*, exclude from filters |
| 24 | Vehicle Owner | File inputs unconstrained | Type/size limits + preview + progress |
| 25 | Vehicles | Jargon unexplained | Tooltips + glossary links |
| 26 | Vehicles | No plate validation | Zod regex + legacy fallback |
| 27 | Other's Vehicle | 1-field create form | Build as-is; derive display columns; document limitation |
| 28 | Reports | Export only on Detail Entry | Standardise Print + Excel header on both reports |
| 29 | Reports | Plain select filters | Searchable async comboboxes |
| 30 | Reports | Silent empty result on default date range | Empty state with widen-range hint |
| 31 | Generate QR | No context | Caption + Regenerate + Copy + Print |

---

## 10. Design constraints and known limitations

These constraints are recorded verbatim so that future contributors understand which
behaviours are **intentional parity** and which are **improvements**.

1. **The journey is fixed at CP1 → CP2 → CP3.** Confirmed across all queue entries. The
   rebuild preserves this constraint; generalising to *n* checkpoints is out of scope and
   documented as future work.
2. **Narration has no create path in the source application.** Verified across every screen.
   The rebuild preserves the read-and-edit-only UI and seeds the lookup with realistic
   strings.
3. **The Other's Vehicle create form contains a single field.** The rebuild matches the
   source. `Formated No` and `Number Type` are derived in the mock for display.
4. **`Linked Owner` and `IsAssigned` columns are unpopulated.** They are rendered for parity,
   excluded from filter UI, and labelled *(not populated)*.
5. **Bikram Sambat is the only calendar.** No Gregorian toggle is provided. All dates,
   receipt numbers, and report ranges derive from BS.
6. **Fee types beyond काटा शुल्क were not observable.** The data model supports multiple
   `FeeLine`s; only one default is seeded. Flagged for confirmation against the source
   system.
7. **The QR payload semantics are unknown.** The generated QR is treated as an opaque token
   with Regenerate, Copy, and Print actions.

---

## 11. Implementation decisions for TQMS-Pulse

### 11.1 Architecture

- **Next.js App Router + TypeScript.**
- Routes live under `src/app/` and are **thin**: they compose feature modules. No business
  logic in `app/`.
- **Feature-based modules.** Each feature owns its `types.ts`, `schemas.ts` (Zod),
  `api.ts`, `hooks/`, and `components/`. Features cannot import each other's internals —
  enforced by an ESLint import-boundary rule.
- **Reusable UI primitives** live in `src/components/ui` (shadcn). Domain-agnostic shared
  components live in `src/components/shared` — `<DataTable>`, `<FilterBar>`,
  `<StatusBadge>`, `<ConfirmDialog>`, `<EmptyState>`, `<ErrorState>`, `<Skeleton>`,
  `<PageHeader>`, `<Breadcrumbs>`.

### 11.2 State management

| Concern | Tool |
|---|---|
| Server state | **TanStack Query** — per-feature query keys; `refetchInterval: 15s` on Queue |
| Forms | **React Hook Form + Zod** |
| Dialog / menu / sidebar | Local `useState` + Radix primitives |
| Session | HttpOnly cookie set by `/api/auth/login`; read server-side |
| Global store | **None.** No cross-cutting global state justifies Zustand or Redux |

### 11.3 Mock backend

- Implemented as **Next.js Route Handlers** under `src/app/api/…`.
- Data lives in `src/mocks/db.ts` (in-memory store with `localStorage` persistence for
  session continuity).
- Every handler awaits `mockDelay()` (300–700 ms) to exercise loading states.
- Response envelope: `{ data, meta?, errors? }`.
- Status codes: `200`/`201` ok · `400` bad request · `404` not found · `409` conflict
  (e.g. vehicle already queued) · `422` field validation · `500` simulated server error.
- `?fail=1` on any endpoint forces a `500` response so error-retry paths can be demonstrated.
- All seeding, filtering, pagination, and receipt-number generation live in
  `src/mocks/helpers/` — fully isolated from both the UI and the route handlers.

### 11.4 Backend replacement strategy

All HTTP calls are isolated in `features/<domain>/api.ts`. Swapping to a real backend is a
matter of:

1. Setting `NEXT_PUBLIC_API_BASE_URL` to the production URL.
2. Deleting `src/app/api/*`.

**No component ever calls `fetch` directly** — enforced by ESLint and verified in review.
The fetcher in `lib/fetcher.ts` handles base URL, headers, envelope unwrapping, and error
mapping so that UI components remain unchanged when the backend swaps.

### 11.5 Performance

- Server components for the shell; client components only where interactivity requires them.
- TanStack Query caches list pages and detail views per feature; mutations invalidate the
  relevant query keys.
- Table and card lists virtualise at scale (TanStack Table with pagination defaults;
  virtualisation added if dataset grows past 200 rows).
- Images and logos served through `next/image`.
- Skeletons rendered immediately; data streams in via Suspense boundaries per route.

### 11.6 Accessibility

- Every table row exposes `aria-label` describing the record.
- Status badges convey meaning via colour, text, and `aria-label`.
- All dialogs and drawers focus-trap on open and restore focus on close.
- Esc closes dialogs, sheets, and the mobile sidebar.
- Forms are fully keyboard navigable; field errors are announced via `aria-live`.
- Colour contrast meets WCAG AA for text and interactive elements.

### 11.7 Testing plan

| Layer | Tool | Coverage |
|---|---|---|
| Unit | Vitest | Receipt-number generation, BS date helpers, formatters, Zod schemas |
| Component | React Testing Library | `<DataTable>`, `<ConfirmDialog>`, `<StatusBadge>`, `<ReceiptPreview>` |
| Route handlers | Vitest + `next-test-api-route-handler` | All `src/app/api/*` endpoints including error paths |
| End-to-end | Playwright (optional) | Login → Add Queue → Check In → End Journey → Report |

---

## 12. Appendix A — Data model

Canonical TypeScript types (abridged), living in `features/<domain>/types.ts`.

```ts
export interface Receipt {
  receiptNo: string;              // INX_<BS year>_<sequence>
  type: "loadboard-sthaniya" | string;
  dateBS: string;                 // "2083-07-20"
  time: string;                   // "10:12 PM"
  weighStation: string;           // checkpoint id (lookup)
  vehicleNo: string;
  goods: string;
  description: string;            // narration
  weightKg: number;
  feeLines: FeeLine[];
  totalAmount: number;            // derived
}

export interface FeeLine {
  label: string;                  // e.g. "काटा शुल्क"
  amount: number;                 // 50
}

export interface QueueEntry {
  id: string;
  receipt: Receipt;
  status:
    | "pending"
    | "in_queue"
    | "in_job"
    | "unregistered"
    | "payment_pending"
    | "closed";
  queueNumber?: string;
  entryDateBS: string;
  lastCheckpointId?: string;
  routeId: string;
  fromCheckpointId: string;
  toCheckpointId: string;
  transportCompany?: string;
  driverPhone?: string;
  ownerId?: string;
  vehicleId?: string;
  isRegistered: boolean;
  cardRegistered: boolean;
  journey: JourneyRow[];          // fixed at 3 entries or fewer
}

export interface JourneyRow {
  sequence: 1 | 2 | 3;
  entryDateBS: string;
  from: string;
  to: string;
  weightKg: number;
  checkpointName: string;
  billNo: string;                 // == receiptNo for that checkpoint
}
```

---

## 13. Appendix B — Mock API sketch

Endpoint contract (full specification lives in `docs/mock-api.md`).

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Mock login; sets HttpOnly session cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current session profile |
| GET / POST | `/api/check-users` | List (search, paginate) / create |
| GET / PATCH / DELETE | `/api/check-users/:id` | Detail / update / delete |
| GET / PATCH | `/api/narrations` / `:id` | List / edit (no create) |
| GET | `/api/queue?status=…&vehicleId=…&cardType=…&vehicleType=…` | Queue list |
| POST | `/api/queue` | Create queue + receipt (returns `{ queue, receipt }`) |
| GET | `/api/queue/:id` | Check-in summary |
| GET | `/api/queue/:id/journey` | Journey table (CP1..CP3) |
| POST | `/api/queue/:id/check-in` | Transition to In Job |
| POST | `/api/queue/:id/end-journey` | End journey |
| GET | `/api/receipts/:receiptNo` | Receipt lookup (reprint) |
| GET / POST / PATCH | `/api/vehicle-owners` / `:id` | Owner CRUD (no delete) |
| GET / POST / PATCH | `/api/vehicles` / `:id` | Vehicle CRUD (no delete) |
| GET / POST / PATCH | `/api/others-vehicles` / `:id` | Other's vehicle CRUD (no delete) |
| GET | `/api/reports/checkpoint-entry?user=&from=&to=` | Aggregate report |
| GET | `/api/reports/detail-entry?from=&to=&vehicle=&goods=&bill=` | Detail report |
| GET | `/api/reports/detail-entry/export?…` | CSV / XLSX stream |
| POST | `/api/qr/generate` | Returns base64 QR payload |
| GET | `/api/lookup/:type` | states, districts, checkpoints, vehicle-types, plate-types, plate-colors, sthaniya-sangh, routes, card-types, others-types, goods, bills, fee-types |

**Conventions enforced by every handler:**

- Envelope: `{ data, meta?, errors? }`
- Validation errors: `422 { errors: { field: [message] } }`
- Conflict (e.g. vehicle already queued): `409`
- Not found: `404`
- Simulated server error: `500` (also triggerable via `?fail=1`)
- Every handler awaits `mockDelay()` to exercise loading states.

---

## 14. Appendix C — Feature folder mapping

```
src/features/
├── auth/
├── check-users/
├── narrations/
├── queue/
├── add-queue/                # separated from queue (write flow)
├── vehicle-owners/
├── vehicles/
├── others-vehicles/
├── reports/
│   ├── checkpoint-entry/
│   └── detail-entry/
├── qr/
└── profile/
```

Each feature contains:

```
features/<domain>/
├── api.ts                    # fetch calls (only place fetch appears)
├── types.ts                  # DTOs specific to this domain
├── schemas.ts                # Zod schemas for forms / validation
├── hooks/                    # TanStack Query wrappers
└── components/               # domain components (table, form, details)
```

Routes in `src/app/` compose these features; they never contain business logic.

---

## Sign-off

This document captures the complete observed state of the TQMS application, the 31-item
consolidated UX register, the 7 recorded design constraints, and the implementation
decisions taken for the TQMS-Pulse rebuild. It serves simultaneously as:

- Assessment section 2 (System analysis)
- Assessment section 7 item 5 (System analysis documentation)
- Internal reference for architectural decisions documented in `docs/decisions/`
