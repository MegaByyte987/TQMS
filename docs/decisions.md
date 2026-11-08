

### ADR-0001: Adopt Feature-Based Architecture

- **Status:** Accepted
- **Date:** 2026-11-08

#### Context

The project requires a scalable and maintainable structure. A traditional "type-based" architecture (e.g., all components in one folder, all hooks in another) leads to a sprawling codebase where related code is physically separated, making it difficult to understand a feature's full scope.

#### Decision

We will adopt a **feature-based architecture**. All code related to a specific domain (e.g., `queue`, `vehicles`, `check-users`) will be grouped within the `src/features/` directory.

Each feature will contain its own API client, hooks, components, and types.

#### Consequences

- **Pros:**
  - High cohesion and low coupling.
  - A single change to a business rule lives in one place.
  - New developers can understand a feature by exploring a single directory.
  - The boundary between features is explicit, enforced by an ESLint rule.

- **Cons:**
  - Requires developer discipline to avoid reaching into another feature's internal modules.
  - Shared logic must be carefully identified and moved to `lib/` or `components/shared/`.

---

### ADR-0002: Use TanStack Query for Server State

- **Status:** Accepted
- **Date:** 2026-11-08

#### Context

The application frequently fetches, caches, and updates server data (lists of users, queue entries).

Managing this with `useState` and `useEffect` would lead to repetitive boilerplate for loading, error, and caching states, and the risk of race conditions.

#### Decision

We will use **TanStack Query (v5)** to manage all server state.

It provides:

- Built-in caching and background refetching.
- First-class support for loading, error, and empty states.
- Mutations with automatic cache invalidation (`invalidateQueries`).
- A declarative API (`useQuery`, `useMutation`) that simplifies component logic.

#### Consequences

- **Pros:**
  - Drastically reduces boilerplate.
  - The UI is always in sync with the server state.
  - Features like `placeholderData: keepPreviousData` improve perceived performance on pagination.

- **Cons:**
  - Introduces a dependency that developers must learn.
  - The cache needs to be invalidated correctly after mutations, which requires a clear understanding of query keys.

---

### ADR-0003: Handle Bikram Sambat (BS) Dates Exclusively

- **Status:** Accepted
- **Date:** 2026-11-08

#### Context

The TQMS system is used in Nepal and all operational dates (receipts, reports) are in the Bikram Sambat (BS) calendar.

The source system does not support Gregorian dates. Mixing the two calendars is a major source of bugs.

#### Decision

All date-related logic will use the BS calendar.

- The `nepali-date-converter` library will be used for conversion.
- Dates will be stored and transmitted as strings in the `YYYY-MM-DD` format.
- A `DateBSField` component will be built to enforce this format in forms.

#### Consequences

- **Pros:**
  - Consistency with the real-world domain.
  - Eliminates ambiguity.
  - Simplifies backend logic, as the server only needs to handle BS dates.

- **Cons:**
  - Developers unfamiliar with the BS calendar must be careful.
  - Any integration with external systems (e.g., a future payment gateway) that uses Gregorian dates will require explicit conversion at the boundary.

---

### ADR-0004: Fix the Journey at CP1–CP3

- **Status:** Accepted
- **Date:** 2026-11-08

#### Context

The source system models a journey as a fixed sequence of up to three checkpoints (CP1, CP2, CP3).

This is a known constraint that affects the data model, the journey table UI, and the receipt structure.

#### Decision

We will **preserve this constraint** in the rebuild.

- The data model will use a fixed-length array of three items for checkpoint visits.
- The journey table will always render exactly three checkpoint columns.

#### Consequences

- **Pros:**
  - Exact parity with the source system.
  - Simplifies the UI and data model.
  - No speculative generalisation for an uncertain requirement.

- **Cons:**
  - If the business later needs journeys with a variable number of checkpoints, the data model and UI will require a significant refactor.