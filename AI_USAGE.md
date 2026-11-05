# AI Usage

## 1. Tools Used

- **ChatGPT:** Used for project planning, technical discussions, reviewing architectural decisions, generating ASCII wireframe concepts during UI planning, and generating diagrams to help understand technical problems such as concurrency.
- **OpenCode (DeepSeek V4.1 Flash – Free):** Used as a coding assistant during implementation to help write code.

## 2. Prompts and Usage

### 1. Project Planning (ChatGPT)

I provided the assignment requirements alongside my preferred technology stack, project structure, architectural boundaries, dependency flow, endpoint requirements, and testing priorities. Used the discussions to refine the implementation approach, technical decisions, and understand important things like the ranking, and also the concurrency (I do generate diagrams for this to understand the problem well).

**Initial prompt:**

```text
lets work on this web project. will be specific and target focused.

my take stake i will use for this

1. typescript
2. react
3. node js
4. express
5. postgresql (may use prisma)

structure:

- types package only for the contract between request and response shapes
- validation a (optional will be work on it after doing the asssingment)
- api
- web

api structure

- error contructs (a single AppError with error codes)
- db
- services
- controllers
- middlewares
- routes

all dependency injection, and also their dependency flow is

routes -> middlewares -> controllers -> services -> db

- middlewares parse the requesting users and call validations when available
- controllers will not contain any logic they just call services and return the response
- services will containe the business logic,
- db handles db processes and transactions

endpoints (may have other endpoints):

endpoints
- users fetching
- list places endpoint
    - query params: sort and category
    - sort by rate score (rate level and number of reviews)

- place detail endpoint
    - include the place details
    - include tour slots and slot status full, and remaingin seats
- booking/seats fetching endpoint of a slot
- booking submission endpoint
- review submission endpoint
- review list endpoint for the place details page

Bugs:
- The score for sorting by rate should account both the rate and
    the number of reviewers
- seat should not be overbooked, concurrency handling and clear message
    for taken seats and full status

Web structure

- components
- layouts
- providers
- pages
- app.tsx  (wiring place)

tests (only api tests)

- rate scoring logic for sorting (high priority)
- concurrency testing (high priority)
- user identification logic
- correct slot status (remaining seats or full)
```

### 2. UI Wireframe Concepts (ChatGPT)

Used ChatGPT to generate ASCII wireframe concepts for the application's pages. Reviewed and refined the proposed layouts through discussion before using them as references during implementation.

## 3. Limitations and Verification

I didn't get that much mistakes on the AI while working on this project. This may be because important aspects, such as the project structure, API endpoints, and their response shapes, were documented before starting any coding.

However, during implementation, AI-generated code did not always respect the established project structure and architectural boundaries. Some suggestions placed responsibilities in inappropriate layers or deviated from the intended organization. I reviewed and adjusted these implementations to maintain the established architecture.

Another instance involved the ranking formula. During testing, I encountered unexpected test failures when the review-count differences between compared places were very small. Investigating this led me to understand how both the overall average rating and the difference in review counts between the compared places influence the formula's results. AI could help explore the behavior, but it did not determine whether this behavior was acceptable for the intended ranking or whether a different solution was needed. That required further investigation and my own judgment.

AI outputs were treated as assistance rather than final decisions. I remained responsible for reviewing the suggestions, verifying the implementation, and making the final technical decisions.
