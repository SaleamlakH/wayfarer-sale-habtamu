# Technical Decisions

This document records the major architectural and technical decisions made during the development of Wayfarer, including the reasoning behind the selected approaches and their trade-offs.

The two central correctness decisions are documented first: rating and ranking, and concurrent booking.

## Table of Contents

- [1. Rating and Ranking](#1-rating-and-ranking)
- [2. Booking and Concurrency](#2-booking-and-concurrency)
- [3. Project Architecture](#3-project-architecture)
- [4. Shared Types](#4-shared-types)
- [5. Dependency Injection](#5-dependency-injection)
- [6. Error Handling](#6-error-handling)
- [7. Database and Repository Pattern](#7-database-and-repository-pattern)
- [8. Testing Strategy](#8-testing-strategy)

## 1. Rating and Ranking

### Problem

Sorting places using only their average rating can produce misleading results.

For example, a place with a single five-star review could rank above a place with hundreds of reviews averaging 4.7 stars.

The number of reviews provides additional information about the reliability of an average rating.

### Decision

The ranking calculation must account for both:

1. The average rating of a place.
2. The number of reviews associated with that place.

A place with very few reviews should not automatically outrank a place with a substantially larger and consistently positive review history.

> Having more reviews does not guarantee that a place will outrank a place with a higher rating but fewer reviews. Its rating must be supported by sufficient evidence to be considered reliable (see more on the ranking method behaviors).

### Ranking Method: Bayesian Weighted Rating

Wayfarer uses the **Bayesian Weighted Rating** method to rank places based on both their average ratings and the reliability of those ratings.

The objective is to ensure that a place's ranking reflects not only how positively it has been rated, but also how much evidence supports that rating. A place with five 5-star reviews should not automatically outrank a place with hundreds of reviews averaging 4.8 stars.

**Formula:**

$$
Score = \frac{v}{v+m}R + \frac{m}{v+m}C
$$

$$
Score = C + \frac{v}{v+m}(R-C)
$$

Where:

- **R:** The place's own average rating.
- **v:** The total number of reviews for that place.
- **m:** A configurable minimum review-count threshold that controls how much evidence is required before trusting a place's own rating.
- **C:** The overall average rating across the reference population of places.

**Data scope:** The overall average rating (`C`) will be calculated using the entire available dataset of places, rather than a sample.

**Why this method is chosen**

The formula balances a place's individual rating against the overall average rating. When a place has relatively few reviews, its score stays closer to the overall average. As its review count increases, its individual rating receives more influence over its final ranking.

This prevents places with very few reviews from gaining disproportionately high rankings based on limited feedback, while allowing consistently well-rated places with sufficient reviews to earn higher positions.

The threshold `m` provides control over ranking sensitivity. A higher threshold makes the ranking more conservative, requiring more reviews before individual ratings have substantial influence. A lower threshold makes it more responsive to places with fewer reviews.

### Ranking Behavior

The Bayesian weighting formula balances the target place's actual rating against the overall average. Its behavior is influenced by two related factors:

**1. Target Rating Relative to the Overall Average**

The difference between the target rating and the overall average is the primary factor determining the direction and magnitude of the score adjustment.

- A rating significantly above the overall average produces a higher weighted score.
- A rating slightly above the overall average produces a smaller increase.
- A rating equal to the overall average produces no adjustment, regardless of review count.
- A rating below the overall average produces a lower weighted score.

Consequently, having a high review count does not automatically result in a higher ranking. A place must also have a rating that justifies its position relative to the overall average.

**2. Review Count Difference Between Places**

The relative difference in review counts between competing places influences their ranking positions.

- When review counts are close, differences in their actual ratings have a stronger influence on the ranking.
- When one place has considerably more reviews, its rating receives relatively more weight, potentially allowing it to outrank a place with a higher average rating but fewer reviews.
- However, a sufficiently higher average rating can still allow a place with fewer reviews to outrank a place with more reviews.

This is expected behavior: review count differences influence how much rating advantage a place with fewer reviews needs to maintain a higher ranking.

### Verification

The ranking behavior is verified by comparing:

- **One 5.0 review against 100 reviews averaging 4.7:** the place with 100 reviews must rank higher.
- **One review against 3 reviews at the same 4.67 average:** the place with 3 reviews must rank higher.
- **One 4.6 review against 100 reviews averaging 4.4:** when both are weighted against a 4.5 overall average with a high minimum review count, the 4.6 place must rank higher because it is above the overall average. this expected and show how the overall average affects the weight.

## 2. Booking and Concurrency

### Problem

A tour slot has a fixed capacity. When multiple booking requests arrive concurrently, they must not reserve seats based on the same outdated availability.

For example:

- Slot capacity: 10 seats.
- Existing bookings: 8 seats.
- Remaining capacity: 2 seats.
- Two users submit booking requests simultaneously.

Without concurrency protection, both requests could observe two remaining seats and collectively reserve more seats than the slot can accommodate.

### Decision

Booking operations must be atomic and protected against concurrent modifications.

The selected approach is to use PostgreSQL transactions and row-level locking on the requested tour slot.

The booking operation follows these steps:

1. Begin a database transaction.
2. Acquire a row-level lock on the requested tour slot using `SELECT ... FOR UPDATE`.
3. Calculate the remaining capacity using the committed bookings.
4. Compare the available capacity with the requested quantity.
5. Reject the entire booking if the available capacity is insufficient.
6. Otherwise, create the booking for the full requested quantity.
7. Commit the transaction.

The lock is held until the transaction commits or rolls back, so concurrent booking requests for the same slot are serialized at the database level.

### Repeat Bookings

A user who has already booked seats in a tour slot may book again while seats remain available. Each request creates a new, separate booking rather than modifying or merging with an existing booking.

### Concurrency Verification

The concurrency behavior is verified against a real PostgreSQL database:

- **Capacity 1, two simultaneous 1-seat requests:** exactly one succeeds, the other is rejected, and 1 seat is booked.
- **Capacity 4, two simultaneous 3-seat requests:** exactly one succeeds, 3 seats are booked, and 1 seat remains.
- **Capacity 4, two simultaneous 2-seat requests:** both succeed, 4 seats are booked, and 0 seats remain.
- **Capacity 6, nine simultaneous 2-seat requests:** exactly 3 succeed, 6 are rejected, and 6 seats are booked.
- **Insufficient capacity:** a request larger than the remaining seats is rejected in full, with no partial booking created.

These cases verify that booked seats never exceed capacity and that successful requests always reserve their full quantity.

## 3. Project Architecture

The application follows a layered architecture that separates HTTP request handling, application logic, and database operations.

The project is organized into three main packages:

- `packages/types`: Shared request, response, and API error contracts.
- `apps/api`: Backend application and API implementation.
- `apps/web`: Frontend application.

The architecture prioritizes separation of responsibilities, dependency injection, and testability without introducing unnecessary abstractions.

### Backend Dependency Flow

```text
Routes --> Middlewares --> Controllers --> Services --> Repositories --> Database
```

Each layer receives its dependencies through dependency injection rather than constructing its own dependencies.

### Middleware Responsibilities

Middlewares prepare the request before it reaches the controller.

For this project, middleware responsibilities include:

- Extracting the acting user's ID from the request.
- Retrieving the corresponding user through the repository.
- Attaching the resolved user to the request object.
- Performing request validation when the validation layer is available.

Middleware may depend on repositories for data retrieval and on validation functionality when available. It does not depend on services for these responsibilities.

## 4. Shared Types

A dedicated shared package is used to define contracts between the frontend and backend.

Its responsibilities include:

- Request shapes.
- Response shapes.
- API error codes.
- API error response shapes.

This separation prevents frontend contracts from becoming coupled to the database schema or backend implementation.

## 5. Dependency Injection

Dependencies are constructed in a composition root and injected into the components that require them.

This approach provides:

- Explicit dependencies.
- Easier unit and integration testing.
- Reduced coupling between layers.
- The ability to replace implementations without changing dependent business logic.

Services depend on repository interfaces rather than directly accessing the database client.

## 6. Error Handling

The API uses a centralized application error mechanism.

A single `AppError` implementation represents expected application errors using predefined error codes.

The shared types package defines the error codes and response contract, while the API owns the error implementation and HTTP status mapping.

Error handling responsibilities are separated as follows:

- Services throw application errors when business rules cannot be satisfied.
- Controllers do not individually translate application errors.
- Centralized error middleware converts errors into consistent HTTP responses.
- The frontend interprets shared error codes and presents appropriate feedback.

This avoids duplicated error-handling logic across controllers and services.

## 7. Database and Repository Pattern

Database operations are separated from business logic through repositories.

Services depend on repository interfaces, while repository implementations handle persistence and database-specific operations.

The repository layer is responsible for:

- Database queries.
- Creating and updating records.
- Retrieving related data.
- Executing database transactions.
- Implementing concurrency-control operations.

Services coordinate application operations and define the required business behavior without depending directly on ORM-specific APIs.

### ORM and Database Access

Prisma is used for schema management, migrations, and ordinary database operations.

Repository implementations encapsulate Prisma queries so that services do not depend directly on the ORM.

Raw SQL may be used for database operations that require functionality not conveniently exposed through Prisma. This is particularly relevant to the booking concurrency requirement, which uses PostgreSQL row-level locking.

## 8. Testing Strategy

Testing focuses on application behavior and the areas most vulnerable to incorrect implementation.

### Implemented Coverage

- Rating calculation: weighted scores are compared for places with the same average but different review counts, places with different averages and review counts, a single 5.0 review against a 4.8 average over 100 reviews, zero-review places, and a zero minimum review count.
- Concurrent booking and insufficient capacity: concurrent requests are checked for last-seat races, all-or-nothing rejection, high contention, fully booked slots, and availability fields against a real PostgreSQL database.
- Review updates: a second review from the same user updates that user's existing review for the place.

The concurrency tests exercise actual database transaction behavior rather than mocked database operations.
