# API Endpoints

This document describes the endpoints listed in the README API overview, including the input each endpoint accepts and the response shape it returns.

## 1. Conventions

- **Base path:** `/api`
- **Content type:** `application/json`
- **Identifiers:** opaque strings.
- **Timestamps:** ISO 8601 UTC strings, for example `2026-11-02T09:30:00.000Z`.
- **Acting user:** endpoints that act on behalf of a user read the seeded user ID from the `X-User-Id` header.
- **Sorting:** handled by the backend. The frontend only renders the order it receives.

## 2. Endpoints Overview

| Method | Path                               | Purpose                                           | `X-User-Id`  |
| ------ | ---------------------------------- | ------------------------------------------------- | ------------ |
| GET    | `/health`                          | Check that the API is running.                    | Not required |
| GET    | `/api/users`                       | List predefined users for the acting-as selector. | Optional     |
| GET    | `/api/places`                      | List places with category filtering and sorting.  | Optional     |
| GET    | `/api/places/:placeId`             | Get place details and tour availability.          | Optional     |
| GET    | `/api/places/:placeId/reviews`     | List reviews for a place.                         | Optional     |
| POST   | `/api/places/:placeId/reviews`     | Create or update the acting user's review.        | Required     |
| POST   | `/api/tour-slots/:slotId/bookings` | Reserve seats in a tour slot.                     | Required     |

## 3. Health

The health endpoint is outside the `/api` base path.

### `GET /health`

**Response `200 OK`**

Content type: `text/plain`.

```text
Hello
```

## 4. Errors

Every error response has the same shape:

```json
{
  "error": {
    "code": "INSUFFICIENT_CAPACITY",
    "message": "Not enough seats available for this tour slot.",
    "details": {
      "requestedSeats": 3,
      "availableSeats": 1
    }
  }
}
```

`details` is optional. The error codes returned by the API are:

| Code                    | HTTP status | When                                            |
| ----------------------- | ----------- | ----------------------------------------------- |
| `VALIDATION_ERROR`      | 400         | Invalid path, query, header, or body input.     |
| `USER_NOT_FOUND`        | 401         | `X-User-Id` does not match a seeded user.       |
| `PLACE_NOT_FOUND`       | 404         | The requested place does not exist.             |
| `TOUR_SLOT_NOT_FOUND`   | 404         | The requested tour slot does not exist.         |
| `INSUFFICIENT_CAPACITY` | 409         | Fewer seats remain than the requested quantity. |
| `INTERNAL_ERROR`        | 500         | Unexpected server failure.                      |

## 5. Users

### `GET /api/users`

**Input**

No parameters.

**Response `200 OK`**

```json
[
  { "id": "user_1", "name": "Amina" },
  { "id": "user_2", "name": "Daniel" },
  { "id": "user_3", "name": "Sara" }
]
```

## 6. Places

### `GET /api/places`

**Input**

| Name       | Location | Type   | Required | Description                                                                                                                 |
| ---------- | -------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `category` | query    | string | No       | Category ID. Returns only places in that category.                                                                          |
| `sort`     | query    | string | No       | `rate` returns places sorted by rating, top-scored first. Unset or any other value returns all places in the default order. |

`category` and `sort` can be combined in a single request.

**Response `200 OK`**

Places are returned in the default order unless `sort=rate` is provided.

```json
[
  {
    "id": "place_1",
    "name": "National Museum",
    "category": { "id": "category_1", "name": "Museum" },
    "description": "A museum covering the region's history and art.",
    "openingHours": "09:00-17:00",
    "rating": { "average": 4.5, "reviewCount": 12 }
  }
]
```

An unknown category ID returns an empty array.

### `GET /api/places/:placeId`

**Input**

| Name      | Location | Type   | Required | Description      |
| --------- | -------- | ------ | -------- | ---------------- |
| `placeId` | path     | string | Yes      | ID of the place. |

**Response `200 OK`**

```json
{
  "id": "place_1",
  "name": "National Museum",
  "category": { "id": "category_1", "name": "Museum" },
  "description": "A museum covering the region's history and art.",
  "openingHours": "09:00-17:00",
  "rating": { "average": 4.5, "reviewCount": 12 },
  "tourSlots": [
    {
      "id": "slot_1",
      "placeId": "place_1",
      "startsAt": "2026-11-10T09:00:00.000Z",
      "capacity": 10,
      "bookedSeats": 8,
      "remainingSeats": 2,
      "isFull": false
    }
  ]
}
```

`tourSlots` contains upcoming slots ordered by `startsAt` ascending.

**Errors**

- `404 PLACE_NOT_FOUND`

## 7. Reviews

### `GET /api/places/:placeId/reviews`

**Input**

| Name      | Location | Type   | Required | Description      |
| --------- | -------- | ------ | -------- | ---------------- |
| `placeId` | path     | string | Yes      | ID of the place. |

**Response `200 OK`**

```json
[
  {
    "id": "review_1",
    "placeId": "place_1",
    "user": { "id": "user_1", "name": "Amina" },
    "rating": 5,
    "body": "Excellent guided tour and very knowledgeable staff.",
    "createdAt": "2026-10-14T18:05:00.000Z"
  }
]
```

**Errors**

- `404 PLACE_NOT_FOUND`

### `POST /api/places/:placeId/reviews`

Creates the acting user's review for the place, or updates it when the user already reviewed that place.

**Input**

| Name        | Location | Type    | Required | Description                   |
| ----------- | -------- | ------- | -------- | ----------------------------- |
| `placeId`   | path     | string  | Yes      | ID of the place.              |
| `X-User-Id` | header   | string  | Yes      | ID of the acting seeded user. |
| `rating`    | body     | integer | Yes      | Rating from `1` to `5`.       |
| `body`      | body     | string  | Yes      | Written review text.          |

```json
{
  "rating": 5,
  "body": "Excellent guided tour and very knowledgeable staff."
}
```

**Response `201 Created`** when a new review is created:

```json
{
  "id": "review_1",
  "placeId": "place_1",
  "user": { "id": "user_1", "name": "Amina" },
  "rating": 5,
  "body": "Excellent guided tour and very knowledgeable staff.",
  "createdAt": "2026-10-14T18:05:00.000Z"
}
```

**Response `200 OK`** when the acting user's existing review is updated, with the same response shape. `createdAt` keeps its original value.

**Errors**

- `400 VALIDATION_ERROR`
- `401 USER_NOT_FOUND`
- `404 PLACE_NOT_FOUND`

## 8. Bookings

### `POST /api/tour-slots/:slotId/bookings`

Reserves the full requested quantity of seats in a tour slot. Partial bookings are never created.

**Input**

| Name        | Location | Type    | Required | Description                        |
| ----------- | -------- | ------- | -------- | ---------------------------------- |
| `slotId`    | path     | string  | Yes      | ID of the tour slot.               |
| `X-User-Id` | header   | string  | Yes      | ID of the acting seeded user.      |
| `seats`     | body     | integer | Yes      | Number of seats, greater than `0`. |

```json
{
  "seats": 2
}
```

**Response `201 Created`**

```json
{
  "id": "booking_1",
  "slotId": "slot_1",
  "userId": "user_1",
  "seats": 2,
  "createdAt": "2026-11-02T10:15:00.000Z",
  "tourSlot": {
    "id": "slot_1",
    "placeId": "place_1",
    "startsAt": "2026-11-10T09:00:00.000Z",
    "capacity": 10,
    "bookedSeats": 10,
    "remainingSeats": 0,
    "isFull": true
  }
}
```

**Errors**

- `400 VALIDATION_ERROR`
- `401 USER_NOT_FOUND`
- `404 TOUR_SLOT_NOT_FOUND`
- `409 INSUFFICIENT_CAPACITY` when fewer than `seats` remain. The error `details` contain `requestedSeats` and `availableSeats`.
