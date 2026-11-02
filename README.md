# Wayfarer

**Honest Ratings, Fair Bookings**

Wayfarer is a full-stack web application that helps travellers discover places in a city, explore guided tours, read reviews, and reserve seats.

The application focuses on two important problems:

- **Unreliable ratings:** Ranking places using only average ratings can produce misleading results when places have significantly different numbers of reviews.
- **Tour overbooking:** Concurrent booking requests must not result in reservations exceeding a tour's available capacity.

## Table of Contents

- [1. Overview](#1-overview)
- [2. Features](#2-features)
- [3. Technology Stack](#3-technology-stack)
- [4. Project Structure](#4-project-structure)
- [5. Architecture](#5-architecture)
- [6. Getting Started](#6-getting-started)
- [7. Development Scripts](#7-development-scripts)
- [8. Database and Seed Data](#8-database-and-seed-data)
- [9. Running Tests](#9-running-tests)
- [10. API Overview](#10-api-overview)
- [11. Known Limitations](#11-known-limitations)

## 1. Overview

Wayfarer allows travellers to browse places within a selected city, view place details, explore available guided tours, and submit reviews.

The application uses a seeded user system rather than authentication. Users can switch between predefined accounts through an acting-as selector in the frontend.

The backend is responsible for business rules, rating calculations, booking availability, and data consistency.

## 2. Features

### Places

- Browse available places.
- Filter places by category.
- Sort places by their rating score.
- View detailed information about a place.
- View reviews and guided tour availability.

### Reviews

- Submit a rating between 1 and 5 stars.
- Include a short written review.
- Maintain one review per user per place.
- Update an existing review when the same user submits another review for the same place.

### Tour Bookings

- View available tour slots.
- View remaining seats and booking status.
- Reserve multiple seats in a single booking.
- Prevent overbooking under concurrent booking requests.
- Reject bookings when the requested quantity exceeds the available capacity.
- Provide clear feedback when a slot has insufficient capacity or is fully booked.

### User Identification

- Use predefined seeded users.
- Switch the currently acting user through the frontend.
- Identify the current user through the `X-User-Id` request header.

## 3. Technology Stack

| Area            | Technology   |
| --------------- | ------------ |
| Language        | TypeScript   |
| Frontend        | React        |
| Backend         | Node.js      |
| API Framework   | Express      |
| Database        | PostgreSQL   |
| ORM             | Prisma       |
| Package Manager | pnpm         |

## 4. Project Structure

```text
wayfarer/
├── apps/
│   ├── api/
│   │   └── .env.example
│   └── web/
│       └── .env.example
├── packages/
│   └── types/
├── docs/
│   ├── API.md
│   ├── DECISIONS.md
│   ├── schema.md
│   └── wireframes/
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
└── README.md
```

The project uses pnpm workspaces to manage the API, web application, and shared types package.

The `docs` directory contains technical decisions and project reference documents, including the database schema and wireframes.

### Shared Types

The shared types package contains contracts exchanged between the frontend and backend, including request shapes, response shapes, and API error contracts.

It does not contain database models or business logic.

### API

The API contains the application logic, request handling, database operations, and centralized error handling.

### Web

The web application contains the user interface, page composition, reusable components, layouts, and application providers.

## 5. Architecture

The backend follows a layered architecture with dependency injection.

The request-processing flow is:

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

### Layer Responsibilities

| Layer        | Responsibility                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Routes       | Define API endpoints and connect middleware and controllers.                                    |
| Middlewares  | Retrieve and attach the acting user through the repository, and perform validation when available. |
| Controllers  | Extract request information, invoke services, and return responses.                 |
| Services     | Implement application operations and business rules.                                |
| Repositories | Handle database queries, persistence, and transaction execution.                    |
| Errors       | Provide centralized application error handling.                                     |

Dependencies are constructed and injected through the application composition root. Individual layers do not instantiate their own dependencies.

## 6. Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL

### 1. Clone the repository

```bash
git clone <repository-url>
cd wayfarer
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Each application has its own example environment file. Copy both and configure the required values.

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Prepare the database

Create the PostgreSQL database specified in your environment configuration.

Apply database migrations:

```bash
pnpm db:migrate
```

Seed the database with the initial users, places, reviews, and tour slots:

```bash
pnpm db:seed
```

### 5. Build workspace dependencies

```bash
pnpm build
```

### 6. Start the application

```bash
pnpm dev
```

## 7. Development Scripts

```bash
pnpm dev          # Start the API and web development servers.
pnpm build        # Build workspace packages and applications in dependency order.
pnpm typecheck    # Type-check all packages and applications.
pnpm test         # Run the API test suite, including database integration tests.
pnpm db:migrate   # Apply database migrations in development.
pnpm db:seed      # Seed the database with initial application data.
```

## 8. Database and Seed Data

The application uses PostgreSQL for persistent storage.

The seed data includes:

- Approximately 10 places.
- Reviews associated with the seeded places.
- Three predefined users.
- Guided tour slots with different capacities and availability.

At least one place has only one or two reviews to demonstrate why average ratings alone are insufficient for reliable ranking.

Database migration and seeding commands are listed in [Development Scripts](#7-development-scripts).

## 9. Running Tests

The API test suite covers the application's important business rules and data consistency requirements.

The test suite includes:

### Highest Priority

- Rating calculation: verify that ranking accounts for both average rating and review count.
- Concurrent booking: verify that simultaneous booking requests cannot exceed slot capacity.

### Additional

- Review creation: verify that the first review creates a database record.
- Review update: verify that subsequent reviews from the same user update the existing record.
- Insufficient capacity: verify that bookings are rejected when the requested quantity exceeds available seats.
- Slot availability: verify remaining seat calculations and full-slot status.
- User identification: verify identification through the `X-User-Id` header.

All required tests should be executable through a single command.

Run the test suite with `pnpm test`.

## 10. API Overview

The API provides the following main operations. Request and response contracts, including the shared error envelope, are documented in [docs/API.md](docs/API.md).

| Resource | Operation               | Description                                                                        |
| -------- | ----------------------- | ---------------------------------------------------------------------------------- |
| Health   | Check API status        | Returns `Hello` when the API is running.                                           |
| Users    | Fetch users             | Retrieve predefined users for the acting-as selector.                              |
| Places   | List places             | Retrieve places with category filtering and rating-based sorting.                  |
| Places   | Get place details       | Retrieve place information and tour slot availability.                             |
| Bookings | Create booking          | Reserve a requested quantity of seats in a tour slot.                              |
| Reviews  | Create or update review | Create a review or update the existing review for the same user and place.         |
| Reviews  | List reviews            | Retrieve reviews associated with a place.                                          |

Sorting, filtering, availability calculations, and business rules are handled by the backend.

The health endpoint is served at `/health`, outside the `/api` base path.

## 11. Known Limitations

- Authentication is intentionally excluded from the assignment scope.
- User identification relies on a predefined user ID supplied through a request header.
- The application is designed around a selected city.
- Booking functionality focuses on reserving quantities of seats rather than selecting individually numbered seats.
- Mobile responsiveness is outside the initial implementation scope unless the required functionality is completed ahead of schedule.
