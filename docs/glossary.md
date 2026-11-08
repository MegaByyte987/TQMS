# TQMS-Pulse Glossary

> A reference for every Nepali term, domain concept, code identifier, and naming
> convention used in the TQMS-Pulse rebuild. Every reviewer, developer, and
> future integrator should be able to answer "what does this word mean?"
> without leaving this file.

---

## 1. Purpose

The TQMS application is used in Nepal by the Nepal Truck Transport
Entrepreneurs' Federation. Its UI mixes English interface labels with Nepali
domain terms (मिति, तौल, रसिद), its domain has concepts that do not translate
cleanly (स्थानीयसंघ), and its source system uses inconsistent naming in a few
places (`Formated No` vs `Plate No`). This glossary exists so that:

1. **Developers** know which code identifier corresponds to which domain term.
2. **Reviewers** can verify that the rebuild preserved source terminology
   verbatim where traceability matters.
3. **Future integrators** understand the domain without needing to reverse-
   engineer it from the source code or the live system.

---

## 2. Domain terms — Nepali to English

The Nepali column shows the term as it appears in the source system and in the
receipt preview. Terms are sorted alphabetically by Devanagari, then by
romanised form.

| Nepali | Romanised | English | Code identifier | Context |
|---|---|---|---|---|
| काटा शुल्क | Kata Shulka | Weighing-slip fee | `feeLine.label: "काटा शुल्क"`, `feeTypes[0]` | The single fee line on a receipt; currently Rs. 50 |
| जम्मा | Jamma | Total | `feeLine` reduction in `ReceiptPreview` | The sum row of the fee table |
| जम्मा शुल्क | Jamma Shulka | Total fee | `Receipt.totalAmount` | Derived sum of all fee lines |
| तौल | Taul | Weight (kg) | `Receipt.weightKg`, `JourneyRowDto.checkpoints[n].weightKg` | Gross weight; always kilograms |
| तौलस्थान | Taulsthan | Weighing station | `Receipt.weighStationId` | The checkpoint where the receipt was issued |
| नेपाल ट्रक यातायात व्यवसायी महासंघ | Nepal Truck Yatayat Byabasayi Mahasangh | Nepal Truck Transport Entrepreneurs' Federation | `ReceiptPreview` header (static) | The organisation that owns the system; appears on every printed receipt |
| पान नं | PAN No. | Permanent Account Number | `VehicleOwner.panNumber` | 9-digit tax identifier of the business |
| फोन नं | Phone No. | Phone number | Various `phoneNumber` fields | Contact number, mobile or landline |
| मिति | Miti | Date | `Receipt.dateBS`, `entryDateBS`, `fromBS` / `toBS` filters | Bikram Sambat calendar date, format `YYYY-MM-DD` |
| रकम | Rakam | Amount | `feeLine.amount` | Currency amount in Rupees |
| रसिद | Rasid | Receipt | `Receipt.receiptNo`, `QueueCard.receiptNo` | The primary document; the system of record |
| रसिद नं | Rasid No. | Receipt Number | `Receipt.receiptNo` — format `INX_<BS year>_<sequence>` | Unique identifier, generated per year |
| समय | Samay | Time | `Receipt.time` | 12-hour clock with AM/PM |
| समान | Saman | Goods | `Receipt.goods`, `loadDetails` | The cargo being carried |
| सवारी नं | Sawari No. | Vehicle Number | `Receipt.vehicleNo`, `Vehicle.plateNo` | The vehicle's plate / formatted number |
| स्थानीय | Sthaniya | Local | `QueueEntry.cardRegistered`, `cardType: "sthaniya"` | A category of local ownership or registration |
| स्थानीयसंघ | Sthaniyasangh | Local Association | `Vehicle.sthaniyaSanghId`, `CheckUser.sthaniyaSanghId` | A local industry body that vehicles register under |
| विवरण | Bibaran | Description | `Receipt.description` (`narration`) | Free-text notes on a receipt |

---

## 3. Domain concepts — English descriptions

These are English terms whose meaning is specific to TQMS and which a reader
unfamiliar with the domain would otherwise misread.

### Checkpoint
A physical weigh-station on a road. Each route passes through up to three
checkpoints, referred to as **CP1**, **CP2**, and **CP3**. A checkpoint:

- Records the weight of a vehicle as it passes.
- Issues a bill number (which equals the receipt number at that checkpoint).
- Appears on the journey table as a column pair (`CP 1` name + `CP1 BillNo`).

The current system is designed around exactly three checkpoints per route — a
constraint recorded in `docs/system-analysis.md` §6.1. The type
`JourneyRowDto["checkpoints"]` is a fixed-length tuple of three nullable
`CheckpointVisit` items, which enforces the constraint at the type level.

### Journey
A sequence of checkpoint visits for a single queue entry. A journey starts when
the vehicle is **checked in** and ends when the operator clicks **End Journey**.
The journey is represented as a fixed-length array in `QueueEntry.journey` and
surfaces in the UI as the CP1–CP3 table.

### Loadboard (स्थानीय)
A receipt category. "Loadboard sthaniya" is printed on every receipt as the
receipt type. It is not currently parameterised — a future enhancement would
allow the operator to choose among receipt categories (see the improvement
register item #18 in `docs/system-analysis.md`).

### Narration
A free-text note that can be attached to a receipt. Narrations are:

- **Read and edit only** in the source system (no create path exists anywhere —
  confirmed by exhaustive screen exploration; recorded as constraint #2 in
  `docs/system-analysis.md`).
- Seeded by the administrator.
- Consumed by the Add New Queue form as a dropdown of common notes.

The rebuild preserves the read-and-edit-only UI in `features/narrations` and
shows an explanatory banner at the top of the list page.

### Other's Vehicle
A vehicle that is **not** part of the registered fleet — temporary, third-party,
or otherwise unregistered. It appears in the queue with status `unregistered`.

The source system's create form for Other's Vehicle has **only one field**
(`Others Type`); the `formatedNo` and `numberType` shown in the list are derived
from that type. This is confirmed behaviour (constraint #3 in
`docs/system-analysis.md`), not a rebuild omission, and is documented in the UI
with a persistent banner.

### Queue entry
The operational record of a vehicle waiting for or undergoing a journey. A queue
entry links a **receipt** (its financial component) to a **vehicle** (its
physical component). The entry moves through statuses:

- `pending` — receipt issued, not yet checked in
- `in_queue` — checked in, waiting at a checkpoint
- `in_job` — actively traveling
- `unregistered` — vehicle is in the Other's Vehicle list
- `payment_pending` — journey complete, bill unpaid
- `closed` — fully settled

Each status transition is an explicit API call (`POST /check-in`,
`POST /end-journey`) and produces a success or conflict response.

### Receipt (रसिद)
The **primary document** of the system. A receipt records:

- Which vehicle was weighed (`सवारी नं`)
- What it was carrying (`समान`)
- What it weighed (`तौल`)
- When it was weighed (`मिति`, `समय`)
- Where it was weighed (`तौलस्थान`)
- What fees were charged (`काटा शुल्क` … `जम्मा शुल्क`)

The receipt number is the identifier used across the queue, the check-in panel,
the journey table, and the reports. When the source system's Detail Entry Report
filters by `Bill No`, it is filtering by the receipt number.

The rebuild fixes the source system's mixed-calendar receipt-number bug
(`INX_2026_2_3` with an AD year on a BS date) by standardising the format to
`INX_<BS year>_<4-digit sequence>`, e.g. `INX_2083_0001`. This is recorded as
improvement #18 in `docs/system-analysis.md`.

### Sthaniyasangh (स्थानीयसंघ)
A local industry association through which vehicles are registered. Every
registered vehicle belongs to exactly one Sthaniyasangh, which appears on
receipts and in the Checkpoint Entry report.

The Sthaniyasangh is a **lookup**, not a CRUD entity — the source system has no
screen for creating or editing them; they are configured by an administrator.

### Sthaniya (स्थानीय)
A category meaning "local". Used to distinguish:

- **`cardType`** — a queue filter value (`sthaniya` vs `general`)
- **`cardRegistered`** — a boolean on the queue entry
- **Receipt category** — "Loadboard sthaniya"

The three usages are related but not identical. When reading code, prefer the
specific field name (`cardType`, `cardRegistered`) over the general term.

---

## 4. Naming inconsistencies preserved for traceability

The source system uses slightly different names for the same concept in
different modules. The rebuild **preserves these names verbatim** so that a
reviewer can cross-reference records between the source system and the rebuild.
The inconsistencies are documented here so that anyone reading the code knows
they are intentional.

| Concept | Source name A | Source name B | Where each is used |
|---|---|---|---|
| Plate number | `Plate No` | `Formated No` | `Plate No` in Vehicles; `Formated No` in Other's Vehicle |
| Serial number | `S.N` | `s-n` (JSON) | Display: `S.N`; storage: `"s-n"` (quoted JSON key) |
| Owner name | `Name/Company` | `Owner Name` | `Name/Company` in the owner list; `Owner Name` in the check-in panel |
| Receipt identifier | `Receipt No.` | `Bill No` | `Receipt No.` in the receipt; `Bill No` in the Detail Entry Report filter and journey table |
| Address | `Address` | `Street Address` | `Address` (concatenated) in lists; `Street Address` in forms |

When writing new code that touches these concepts, use the name from the source
system that the user will see on screen, not the "cleaner" name. The rule is:
**traceability beats tidiness** for a rebuild whose job is to match the source.

---

## 5. Code-level conventions

### Identifiers that carry Nepali meaning
Only two identifiers preserve their Nepali spelling: `sthaniyaSanghId` and
`sthaniya` (as a `cardType` value). All other terms have English code names
even where the UI shows Nepali.

**Why:** Devanagari is not valid in JavaScript identifiers, so transliteration
is unavoidable. Transliterating only the terms that would lose meaning in
English (`sthaniya` is not a synonym for `local association` in the same way
that `taul` is for `weight`) is the correct trade-off.

### Date format
All BS dates are strings in `YYYY-MM-DD` format, e.g. `"2083-07-20"`. The
`BSDate` template literal type (`${number}-${string}-${string}`) documents this
at the type level; runtime validation lives in `isBSDate`. The format is chosen
for lexicographic sorting: `"2083-07-20" < "2083-08-01"` is correct both as
string comparison and as date comparison.

### Currency format
Amounts are stored as `number` (rupees, not paisa) and displayed as
`Rs. 1,500.00` via `formatCurrency` in `lib/formatters.ts`. The `en-NP` locale
is used purely for grouping (comma thousands separator); the app does not use
Devanagari numerals because the source system prints Latin numerals on
receipts.

### Phone format
Stored as raw digits (e.g. `9841234567`), displayed via `formatPhone` as
`984-1234567` for mobiles (10 digits starting `9`) and `01-XXXXXXX` for
landlines (9 digits starting `1`). The distinction matters because Nepal's
mobile and landline numbers have different digit counts and are formatted
differently on receipts.

### Receipt number format
`INX_<BS year>_<4-digit sequence>`, e.g. `INX_2083_0001`. Generated by
`nextReceiptNo` in `mocks/helpers/receipt-number.ts`. The BS year is derived
from the receipt's date (not from the current date), so back-dated receipts
use the correct year. The four-digit sequence keeps the number sortable as a
string in spreadsheets and reports.

---

## 6. Statuses and enums

### Queue status
Enumerated in `features/queue/types.ts` and labelled in `lib/constants.ts`:

| Value | Display label | Badge variant |
|---|---|---|
| `pending` | Pending | `warning` |
| `in_queue` | In Queue | `info` |
| `in_job` | In Job | `success` |
| `unregistered` | Unregistered | `muted` |
| `payment_pending` | Payment Pending | `warning` |
| `closed` | Closed | `secondary` |

### Check user status
Binary — `true` means active, `false` means inactive. The status badge renders
the text label (`Active` / `Inactive`) alongside the colour, per the WCAG fix
recorded as improvement #6 in `docs/system-analysis.md`.

### `Is Individual` (Vehicle Owner)
Boolean that controls the conditional reveal of the Contact Details and
Registration Details sections in the Vehicle Owner form. `false` (company)
reveals the contact and registration sections; `true` (individual) hides them.
The effect is documented in the form with a helper description under the
toggle.

---

## 7. Abbreviations used in the codebase

| Abbreviation | Expansion | Where used |
|---|---|---|
| CP | Checkpoint | `JourneyRowDto`, journey table |
| BS | Bikram Sambat | `BSDate`, `todayBS`, `displayBS` |
| PAN | Permanent Account Number | `VehicleOwner.panNumber` |
| TQMS | Transport Queue Management System | Application title |
| ID | Identifier | Every entity has an `id: string` |
| S.N | Serial Number (ordinal display) | Table first column, `"s-n"` field |
| DTO | Data Transfer Object | `QueueCardDto`, `QueueDetailDto` |
| RHF | React Hook Form | Comment in form components |
| ADR | Architecture Decision Record | `docs/decisions/*` |

---

## 8. Nepali month names (Bikram Sambat calendar)

The BS calendar has 12 months. Their names are used by `displayBS` to render
dates like `20 Mangsir 2083`.

| # | Nepali | Romanised |
|---|---|---|
| 1 | बैशाख | Baisakh |
| 2 | जेठ | Jestha |
| 3 | असार | Ashadh |
| 4 | साउन | Shrawan |
| 5 | भदौ | Bhadra |
| 6 | असोज | Ashwin |
| 7 | कार्तिक | Kartik |
| 8 | मंसिर | Mangsir |
| 9 | पुष | Poush |
| 10 | माघ | Magh |
| 11 | फाल्गुन | Falgun |
| 12 | चैत्र | Chaitra |

The number of days in each month varies year to year and is published annually
by the Nepal Calendar Determination Committee. The `nepali-date-converter`
library ships the tables through 2090 BS; do not hand-roll the calendar.

---

## 9. Changes from the source system's terminology

The rebuild keeps every user-facing Nepali term unchanged. Two English labels
were adjusted for clarity, with the change recorded in the improvement register:

| Source label | Rebuild label | Reason |
|---|---|---|
| `View` (queue card action) | `View` → visual change only | Kept the label; added a distinct icon so it is not confused with `Check In` (improvement #14) |
| `End` (queue card action) | `End` on the card, `End journey` in the confirm dialog | The card is a compact affordance; the dialog is the confirmation. Both consistent with the source system's verbs |

All other labels — `Add New Queue`, `Check User`, `Narration`, `Vehicle Owner`,
`Other's Vehicle`, `Checkpoint Entry`, `Detail Entry Report`, `Generate QR`,
`My Profile`, `Change Password`, `Logout` — are preserved verbatim from the
source system so that an operator moving between the two systems sees the same
navigation labels.

---

## 10. References

- **[System Analysis](./system-analysis.md)** — Full breakdown of the source
  system, including the business workflow and the 31-item UX improvement
  register that produced many of the decisions referenced above.
- **[Mock API Contract](./mock-api.md)** — Complete endpoint specification,
  including the field names and formats that this glossary describes.
- **[Architecture Decisions](./decisions/)** — ADRs explaining why certain
  technical constraints (BS-only dates, fixed CP1–CP3, no global store) were
  chosen.