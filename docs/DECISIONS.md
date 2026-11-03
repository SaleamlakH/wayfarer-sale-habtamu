# Technical Decisions

This document records the major architectural and technical decisions made during the development of Wayfarer, including the reasoning behind the selected approaches and their trade-offs.

## Table of Contents

- [1. Project Architecture](#1-project-architecture)
- [2. Technology Choices](#2-technology-choices)
- [3. Shared Types](#3-shared-types)
- [4. Dependency Injection](#4-dependency-injection)
- [5. Error Handling](#5-error-handling)
- [6. Database and Repository Pattern](#6-database-and-repository-pattern)
- [7. Rating and Ranking](#7-rating-and-ranking)
- [8. Booking and Concurrency](#8-booking-and-concurrency)
- [9. Testing Strategy](#9-testing-strategy)
- [10. Scope and Trade-offs](#10-scope-and-trade-offs)

## 1. Project Architecture

The application follows a layered architecture that separates HTTP request handling, application logic, and database operations.

The project is organized into three main packages:

- `packages/types`: Shared request, response, and API error contracts.
- `apps/api`: Backend application and API implementation.
- `apps/web`: Frontend application.

The architecture prioritizes separation of responsibilities, dependency injection, and testability without introducing unnecessary abstractions.

### Backend Dependency Flow

```text
Routes
  |
  v
Middlewares --------> Repositories
  |                       |
  v                       v
Controllers            Database
  |
  v
Services
  |
  v
Repositories
  |
  v
Database
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

## 2. Technology Choices

The following technologies were selected:

| Technology | Reason |
|---|---|
| TypeScript | Provides static typing across the frontend and backend. |
| React | Used to build the frontend application. |
| Node.js | Backend runtime. |
| Express | HTTP server and routing framework. |
| PostgreSQL | Relational database for application data. |
| Prisma | ORM for database queries, schema management, and migrations. |
| pnpm | Package manager with workspace support for the monorepo. |

## 3. Shared Types

A dedicated shared package is used to define contracts between the frontend and backend.

Its responsibilities include:

- Request shapes.
- Response shapes.
- API error codes.
- API error response shapes.

This separation prevents frontend contracts from becoming coupled to the database schema or backend implementation.

## 4. Dependency Injection

Dependencies are constructed in a composition root and injected into the components that require them.

This approach provides:

- Explicit dependencies.
- Easier unit and integration testing.
- Reduced coupling between layers.
- The ability to replace implementations without changing dependent business logic.

Services depend on repository interfaces rather than directly accessing the database client.

## 5. Error Handling

The API uses a centralized application error mechanism.

A single `AppError` implementation represents expected application errors using predefined error codes.

The shared types package defines the error codes and response contract, while the API owns the error implementation and HTTP status mapping.

Error handling responsibilities are separated as follows:

- Services throw application errors when business rules cannot be satisfied.
- Controllers do not individually translate application errors.
- Centralized error middleware converts errors into consistent HTTP responses.
- The frontend interprets shared error codes and presents appropriate feedback.

This avoids duplicated error-handling logic across controllers and services.

## 6. Database and Repository Pattern

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

Prisma is used as the ORM for schema management, migrations, and ordinary database operations.

Repository implementations encapsulate Prisma queries so that services do not depend directly on the ORM.

Raw SQL may be used for database operations that require functionality not conveniently exposed through Prisma. This is particularly relevant to the booking concurrency requirement, which uses PostgreSQL row-level locking.

## 7. Rating and Ranking

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

The ranking calculation will have a dedicated unit test covering:

- Places with identical average ratings but different review counts.
- Places with different average ratings and review counts.
- Places with very few reviews (at least one with 1-2 reviews).
- The expected ordering of representative places.

## 8. Booking and Concurrency

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
2. Acquire a row-level lock on the requested tour slot.
3. Calculate the remaining capacity using the committed bookings.
4. Compare the available capacity with the requested quantity.
5. Reject the entire booking if the available capacity is insufficient.
6. Otherwise, create the booking for the full requested quantity.
7. Commit the transaction.

Concurrent booking transactions for the same slot must be serialized through the row lock.

### Concurrency Control

Booking operations must be atomic and must never create partial bookings.

The implementation uses a PostgreSQL transaction with row-level locking:

1. Start a database transaction.
2. Lock the requested tour slot using `SELECT ... FOR UPDATE`.
3. Calculate the remaining capacity after acquiring the lock.
4. Reject the booking if the full requested quantity is unavailable.
5. Otherwise, create a booking for the entire requested quantity.
6. Commit the transaction.

The lock is held until the transaction commits or rolls back. Concurrent booking requests for the same slot are therefore handled sequentially at the database level.

A request must either receive all the seats it requested or be rejected. The system must never silently reduce the requested quantity.

### All-or-Nothing Booking

Partial bookings are not supported.

If a user requests two seats and only one remains, the entire booking is rejected.

The application must never silently reduce the requested quantity or create a booking for fewer seats than requested.

### Repeat Bookings

A user who has already booked seats in a tour slot may book again while seats remain available. Each request creates a new, separate booking rather than modifying or merging with an existing booking.

### Insufficient Capacity

When a booking cannot be fulfilled, the API returns a clear application error indicating insufficient capacity.

The response should provide the relevant availability information so the frontend can inform the user and allow them to adjust their requested quantity.

### Concurrency Verification

The integration test must use a real PostgreSQL database and submit multiple booking requests concurrently.

The test should verify that:

- The total number of booked seats never exceeds slot capacity.
- Each successful booking reserves its entire requested quantity.
- Requests that cannot be fulfilled are rejected.
- No partial bookings are created.
- The final remaining capacity is correct.

The order in which concurrent transactions acquire the slot lock determines which booking is processed first. The system guarantees capacity consistency, not fairness based on HTTP arrival order.

## 9. Testing Strategy

Testing is focused on application behavior and the areas most vulnerable to incorrect implementation.

### Highest Priority

- Rating calculation: verify that ranking accounts for both average rating and review count.
- Concurrent booking: verify that simultaneous booking requests cannot exceed slot capacity.

### Additional

- Review creation.
- Updating an existing review.
- Insufficient booking capacity.
- Slot availability calculations.
- User identification through request headers.

The concurrency tests must exercise actual database transaction behavior rather than relying on mocked database operations.

## 10. Scope and Trade-offs

The assignment has a limited time budget. Implementation decisions prioritize the required functionality and correctness over unnecessary complexity.

The following are intentionally excluded from the initial scope:

- Full authentication and authorization.
- Individually numbered seat selection.
- Partial booking fulfillment.
- Additional features unrelated to place discovery, reviews, and tour bookings.
- Extensive infrastructure and deployment automation.

Potential improvements can be considered after the required functionality and tests are complete.
