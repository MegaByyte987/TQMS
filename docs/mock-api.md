# TQMS-Pulse Mock API Contract

All endpoints are prefixed with `/api`. The mock backend is implemented using Next.js Route Handlers.

## General Conventions

### Response Envelope

Every successful response follows this structure:

```json
{
  "data": "<T>",
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

- `data`: The payload (object, array, or null).
- `meta`: Optional pagination metadata, present on list endpoints.

### Error Response

Validation errors return a `422 Unprocessable Entity` status with a field-level error map.

**Example:**

```json
{
  "data": null,
  "errors": {
    "email": ["Enter a valid email address."],
    "mobileNumber": ["Enter a valid 10-digit mobile number."]
  }
}
```

Generic errors (`400`, `404`, `409`, `500`) return a `message` field.

**Example:**

```json
{
  "data": null,
  "message": "Queue entry not found."
}
```

### Simulating Failures

Append `?fail=1` to any endpoint to force a `500 Internal Server Error`.

**Example:**

```http
GET /api/check-users?fail=1
```

---

## API Endpoints

### 1. Authentication

#### POST `/api/auth/login`

Authenticates a user and establishes a session.

**Request Body:**

```json
{
  "username": "checkpoint",
  "password": "checkpoint123"
}
```

**Response (200 OK):**

Sets an HttpOnly `tqms-session` cookie and returns the user object.

```json
{
  "data": {
    "id": "user-1",
    "name": "Checkpoint User",
    "role": "checkpoint-user",
    "checkpoint": "Lodbod Checkpoint"
  }
}
```

#### POST `/api/auth/logout`

Logs out the current user.

**Response (204 No Content):**

Clears the session cookie.

#### GET `/api/auth/me`

Returns the currently authenticated user.

**Response (200 OK):**

Returns the current user if the session cookie is valid.

**Response (401 Unauthorized):**

Returned if no valid session cookie is present.

---

### 2. Check Users

#### GET `/api/check-users`

Fetches a paginated list of check users.

**Query Parameters:**

| Parameter | Description |
|---|---|
| `q` | Search query. |
| `page` | Page number. |
| `pageSize` | Number of records per page. |
| `sort` | Sort field (`s-n` or `name`). |
| `order` | Sort direction (`asc` or `desc`). |

**Response (200 OK):**

Returns a paginated list of check users.

```json
{
  "data": ["<CheckUser>"],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### POST `/api/check-users`

Creates a new check user.

**Request Body:**

```json
{
  "name": "Ram",
  "stateId": "...",
  "districtId": "...",
  "mobileNumber": "..."
}
```

Additional fields may be supplied as required by the `CheckUser` model.

**Response (201 Created):**

Returns the newly created user object.

**Response (422 Unprocessable Entity):**

Returned when validation fails.

#### PATCH `/api/check-users/:id`

Updates an existing check user.

**Request Body:**

Same structure as `POST /api/check-users`.

**Response (200 OK):**

Returns the updated user object.

#### DELETE `/api/check-users/:id`

Deletes an existing check user.

**Response (204 No Content):**

No response body is returned.

---

### 3. Queue

#### GET `/api/queue`

Fetches queue entries with optional filtering and pagination.

**Query Parameters:**

| Parameter | Description |
|---|---|
| `status` | Filters entries by status. |
| `vehicleName` | Filters by vehicle name. |
| `cardType` | Filters by card type. |
| `vehicleType` | Filters by vehicle type. |
| `page` | Page number. |
| `pageSize` | Number of records per page. |

**Response (200 OK):**

Returns a paginated list of queue entries.

```json
{
  "data": ["<QueueCard>"],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### POST `/api/queue`

Creates a new queue entry and issues a receipt.

**Request Body:**

Uses the `AddQueueFormValues` structure, including:

- `vehicleId`
- `fromCheckpointId`
- `grossWeight`
- Other applicable queue form fields.

**Response (201 Created):**

```json
{
  "data": {
    "queue": "<QueueEntry>",
    "receipt": "<Receipt>"
  }
}
```

#### POST `/api/queue/:id/check-in`

Checks in a pending queue entry and moves it into the `in_job` status.

**Response (200 OK):**

Returns the updated `QueueDetailDto`.

**Response (409 Conflict):**

Returned if the entry is not in `pending` status.

#### POST `/api/queue/:id/end-journey`

Ends an in-job journey and moves it into the `payment_pending` status.

**Response (200 OK):**

```json
{
  "data": {
    "id": "<string>",
    "status": "payment_pending"
  }
}
```

**Response (409 Conflict):**

Returned if the entry is not in `in_job` status.

---

### 4. Reports

#### GET `/api/reports/checkpoint-entry`

Fetches checkpoint entry report data.

**Query Parameters:**

| Parameter | Description |
|---|---|
| `userId` | Filters by user ID. |
| `fromBS` | Start date in Bikram Sambat format. |
| `toBS` | End date in Bikram Sambat format. |
| `page` | Page number. |
| `pageSize` | Number of records per page. |

**Response (200 OK):**

Returns a paginated list of checkpoint entry records.

```json
{
  "data": ["<CheckpointEntryRow>"],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### GET `/api/reports/detail-entry`

Fetches detailed entry report data.

**Query Parameters:**

| Parameter | Description |
|---|---|
| `fromBS` | Start date in Bikram Sambat format. |
| `toBS` | End date in Bikram Sambat format. |
| `vehicleNo` | Filters by vehicle number. |
| `goods` | Filters by goods type. |
| `billNo` | Filters by bill number. |
| `page` | Page number. |
| `pageSize` | Number of records per page. |

**Response (200 OK):**

Returns a paginated list of detailed entry records.

```json
{
  "data": ["<DetailEntryRow>"],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### GET `/api/reports/detail-entry/export`

Exports detailed entry report data as a CSV file.

**Query Parameters:**

Uses the same query parameters as `GET /api/reports/detail-entry`, except pagination parameters (`page` and `pageSize`) are ignored.

**Response (200 OK):**

Returns a `text/csv` file stream with a `Content-Disposition` header.

---

## Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticates a user and creates a session. |
| POST | `/api/auth/logout` | Logs out the current user. |
| GET | `/api/auth/me` | Retrieves the authenticated user. |
| GET | `/api/check-users` | Retrieves paginated check users. |
| POST | `/api/check-users` | Creates a check user. |
| PATCH | `/api/check-users/:id` | Updates a check user. |
| DELETE | `/api/check-users/:id` | Deletes a check user. |
| GET | `/api/queue` | Retrieves filtered queue entries. |
| POST | `/api/queue` | Creates a queue entry and issues a receipt. |
| POST | `/api/queue/:id/check-in` | Checks in a pending queue entry. |
| POST | `/api/queue/:id/end-journey` | Ends an in-job journey. |
| GET | `/api/reports/checkpoint-entry` | Retrieves checkpoint entry reports. |
| GET | `/api/reports/detail-entry` | Retrieves detailed entry reports. |
| GET | `/api/reports/detail-entry/export` | Exports detailed entry reports as CSV. |