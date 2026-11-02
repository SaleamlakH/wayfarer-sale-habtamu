# Database Schema

## 1. Entity Overview

| Entity   | Description                                                    |
| -------- | -------------------------------------------------------------- |
| Place    | Represents a destination users can explore and book tours for. |
| Review   | Represents a user's rating and feedback for a place.           |
| TourSlot | Represents a scheduled tour session for a place.               |
| Booking  | Represents a user's reservation for a tour slot.               |
| User     | Represents a user who can make bookings and submit reviews.    |
| Category | Represents a category used to classify places.                 |

## 2. Entities and Columns

### 2.1 Place

Represents a destination users can explore and book tours for.

| Column          | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `id`            | Primary key.                                                   |
| `name`          | Name of the place.                                             |
| `category`      | References the category assigned to the place (`Category.id`). |
| `description`   | Description of the place.                                      |
| `opening_hours` | Opening hours of the place.                                    |

### 2.2 Review

Represents a user's rating and feedback for a place.

| Column       | Description                |
| ------------ | -------------------------- |
| `id`         | Primary key.               |
| `place_id`   | References `Place.id`.     |
| `user_id`    | References `User.id`.      |
| `rating`     | Rating from 1 to 5.        |
| `body`       | Written feedback.          |
| `created_at` | Review creation timestamp. |

**Note:** The combination of `place_id` and `user_id` must be unique. Submitting another review for the same place by the same user updates the existing review.

### 2.3 TourSlot

Represents a scheduled tour session for a place.

| Column      | Description                                        |
| ----------- | -------------------------------------------------- |
| `id`        | Primary key.                                       |
| `place_id`  | References `Place.id`.                             |
| `starts_at` | Scheduled start date and time.                     |
| `capacity`  | Total number of seats available for the tour slot. |

### 2.4 Booking

Represents a user's reservation for a tour slot.

| Column       | Description                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | Primary key.                                                                                                                                 |
| `slot_id`    | References `TourSlot.id`.                                                                                                                    |
| `user_id`    | References `User.id`.                                                                                                                        |
| `seats`      | Total seats booked by this user in this booking. Must be greater than zero. The sum of booked seats for a slot must not exceed its capacity. |
| `created_at` | Booking creation timestamp.                                                                                                                  |

### 2.5 User

Represents a user who can make bookings and submit reviews.

| Column | Description                                               |
| ------ | --------------------------------------------------------- |
| `id`   | Primary key.                                              |
| `name` | User's name. Users are seeded; no passwords are required. |

### 2.6 Category

Represents a category used to classify places.

| Column | Description    |
| ------ | -------------- |
| `id`   | Primary key.   |
| `name` | Category name. |
