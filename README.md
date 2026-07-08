# Smart Shopping Assistant

A full-stack shopping application with an **AI-powered agentic cart analyzer**. Browse a product catalog, build a cart, and get an on-demand analysis that surfaces active promotions, near-miss deals ("add one more to save 20%"), and up to five personalized product suggestions — composed by a two-agent OpenAI workflow.

> LigaAC Labs × Netrom project.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [The AI Cart Analyzer](#the-ai-cart-analyzer)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Project Layout](#project-layout)
- [Common Commands](#common-commands)

---

## Features

- **Product catalog** — products, categories (many-to-many), and promotions, all admin-manageable.
- **Authenticated carts** — each user has one persistent cart; add / update quantity / remove / clear.
- **Deterministic promotion engine** — the cart total, applied promotions, and discounts are computed server-side (`CartService.ComputeAppliedPromotions`), independent of the AI.
- **AI cart analysis** — a sequential two-agent pipeline evaluates promotions and composes product suggestions using function-calling tools over the live catalog.
- **JWT auth with roles** — `User` and `Admin`; write operations on catalog/promotions are `Admin`-only.
- **Avatar upload** — users can upload an avatar, served as a static file from the API.
- **Graceful AI degradation** — if no OpenAI key is configured, the app runs fully; analysis endpoints return a structured "unavailable" payload instead of crashing.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Backend | ASP.NET Core Web API (.NET 10), C# |
| AI | `Microsoft.Agents.AI` + `Microsoft.Extensions.AI`, OpenAI (`gpt-4o` by default) |
| Database | PostgreSQL + Entity Framework Core (Npgsql) |
| Frontend | React 19 + TypeScript, Vite |
| UI | MUI v9, Emotion, `@tanstack/react-query`, React Router v7, Axios, notistack |
| Auth | JWT bearer tokens |

## Architecture

**Request flow:** `Controller → IXxxService (Logic) → IXxxRepository (Data) → PostgreSQL`

### Backend — three-project solution (`backend/backend.slnx`)

```
Api/     ← ASP.NET Core entry point: controllers, DI wiring, JWT + OpenAI config, static files
Logic/   ← Services, DTOs, AI agents & tools, workflow orchestration (no EF references)
Data/    ← EF Core DbContext, entities, repositories, migrations, idempotent seeders
```

- All tables live in the PostgreSQL schema `smart_shopping_assistant`.
- EF configurations live in `Data/Configurations/` as `IEntityTypeConfiguration<T>`.
- The database is **auto-seeded on startup** (`DatabaseSeeder`); seeders are idempotent.

### Frontend — feature-oriented `src/`

```
api/
  base/http.ts     ← axios instance (reads VITE_API_URL), typed get/post/put/remove
  models/          ← raw DTO shapes matching the API contract
  client/          ← one typed client per domain; maps DTOs → domain types
shared/types/      ← clean domain types + `toXxx` mapper functions
shared/format/     ← formatters (RON currency, ro-RO locale)
context/           ← AuthContext + CartContext providers
components/         ← one folder per page/feature; hooks + parts live inside each
themes/            ← MUI dark theme
```

Pages never touch DTO shapes — API clients map raw DTOs into domain types before returning. `@/` is aliased to `src/`. See `frontend/CLAUDE.md` for the detailed component pattern.

## The AI Cart Analyzer

`GET /api/cart/analyze` runs a sequential [`WorkflowBuilder`](backend/Logic/Services/CartService.cs) pipeline of two `ChatClientAgent`s:

```
cart JSON ─► PromotionCheckerAgent ─► SuggestionComposerAgent ─► AnalysisResponse (JSON)
```

1. **`PromotionCheckerAgent`** — a "promotion analyst". Calls the `GetPromotionsForProduct` tool for every product in the cart, evaluates each promotion's threshold (product- vs category-level, quantity vs cart-total), and classifies each as an **active** or **near-miss** deal with the potential savings. Output is constrained to a `PromotionAnalysis` JSON schema.
2. **`SuggestionComposerAgent`** — receives the previous agent's analysis and calls `SearchProducts` / `GetProductsByCategory` to compose up to five product suggestions, returned as the final `AnalysisResponse`.

**AI tools** (`Logic/Tools/ShoppingTools.cs`) are plain functions exposed to the model via `AIFunctionFactory`:

| Tool | Purpose |
| :--- | :--- |
| `GetPromotionsForProduct(productId)` | Active promotions for a product (by id or its category) |
| `SearchProducts(query)` | Keyword search over the catalog |
| `GetProductsByCategory(categoryId)` | All products in a category |

**OpenAI is optional.** If `OpenAI:ApiKey` is absent, DI registers `UnavailablePromotionCheckerAgent` / `UnavailableSuggestionComposerAgent` stubs that return a structured error payload — the rest of the app is unaffected.

> Note: the AI analysis is advisory. The authoritative promotion/discount math is the deterministic engine in `CartService`, not the LLM.

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js (LTS) + npm
- PostgreSQL running locally (default: `Host=localhost;Port=5432;Database=postgres`)

### 1. Backend

```bash
cd backend

# configure the DB connection string (see Configuration below) and, optionally, OpenAI:
dotnet user-secrets set "OpenAI:ApiKey" "sk-..."   --project Api
dotnet user-secrets set "OpenAI:ModelId" "gpt-4o"  --project Api

# apply migrations
dotnet ef database update --project Data --startup-project Api

# run (http://localhost:5211, Swagger UI at /swagger in Development)
dotnet run --project Api
```

The database is seeded automatically on first run.

### 2. Frontend

```bash
cd frontend
npm install

# point the frontend at the backend
echo "VITE_API_URL=http://localhost:5211/api" > .env.local

npm run dev   # http://localhost:5173
```

## Configuration

### Backend (`appsettings.json`, user secrets, or environment variables)

| Key | Required | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `ConnectionStrings:SmartShoppingAssistantContext` | ✅ | — | Npgsql connection string |
| `Jwt:Issuer` / `Jwt:Audience` | ✅ | — | JWT validation |
| `Jwt:SigningKey` | ✅ | — | **Base64-encoded** symmetric signing key |
| `Jwt:ExpiryMinutes` | | `1440` | Token lifetime |
| `OpenAI:ApiKey` | | — | Enables AI analysis when present |
| `OpenAI:ModelId` | | `gpt-4o` | OpenAI model |
| `Cors:FrontendOrigin` | | `http://localhost:5173` | Allowed CORS origin |

> Prefer user secrets / environment variables for secrets — don't commit the signing key or API key.

### Frontend (`.env` / `.env.local`)

| Key | Purpose |
| :--- | :--- |
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5211/api` |

## API Reference

Base path: `/api`. 🔒 = requires JWT bearer token. 👑 = requires `Admin` role.

### Auth — `/api/auth`

| Method | Route | Auth | Description |
| :--- | :--- | :--- | :--- |
| POST | `/register` | | Register a new user |
| POST | `/login` | | Log in, returns a JWT |
| GET | `/me` | 🔒 | Current user profile |
| PUT | `/me` | 🔒 | Update profile |
| POST | `/me/avatar` | 🔒 | Upload avatar image |

### Products — `/api/products`

| Method | Route | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/` | | List products |
| GET | `/{id}` | | Get one product |
| POST | `/` | 👑 | Create |
| PUT | `/{id}` | 👑 | Update |
| DELETE | `/{id}` | 👑 | Delete |

### Categories — `/api/categories` &nbsp;·&nbsp; Promotions — `/api/promotions`

Both follow the same shape as Products: `GET /`, `GET /{id}` are public; `POST /`, `PUT /{id}`, `DELETE /{id}` are 👑 Admin-only.

### Cart — `/api/cart` (all 🔒)

| Method | Route | Description |
| :--- | :--- | :--- |
| GET | `/` | Get cart with computed subtotal, applied promotions, discounts, total |
| POST | `/items` | Add an item (merges quantity if already present) |
| PUT | `/items/{itemId}` | Set item quantity |
| DELETE | `/items/{itemId}` | Remove an item |
| DELETE | `/` | Clear the cart |
| GET | `/analyze` | Run the AI cart analysis pipeline |

## Data Model

Tables live in the `smart_shopping_assistant` schema. See [`docs/db_schema.md`](docs/db_schema.md) for column details.

- **Users** — `Role` is `User` (0) or `Admin` (1); optional `AvatarUrl`.
- **Categories** ⇄ **Products** — many-to-many via `ProductCategories`.
- **Carts** — one per user (aggregate root); **CartItems** hold `(ProductId, Quantity)`.
- **Promotions** — target a `ProductId` *or* a `CategoryId`, and combine:
  - `Type`: `Quantity` (0, item count) or `CartTotal` (1, price in RON)
  - `Reward`: `FreeItems` (0) or `PercentDiscount` (1), with `RewardValue`
  - `Threshold`: the value that must be met to trigger the reward
  - `IsActive`: only active promotions are applied and analyzed

## Project Layout

```
backend/
  Api/       Controllers, Program.cs (DI/JWT/CORS/OpenAI), Options, wwwroot/avatars
  Logic/     Services, DTOs, Agents (+ Unavailable* fallbacks), Tools, Models
  Data/      DbContext, Entities, Configurations, Repositories, Migrations, Seeding
frontend/
  src/       api/, shared/, context/, components/, hooks/, themes/
docs/        db_schema.md, task/ (endpoint & agent design diagrams)
```

## Common Commands

### Backend (from `backend/`)

```bash
dotnet run --project Api                                   # run the API
dotnet build backend.slnx                                  # build the solution
dotnet tool restore && dotnet csharpier .                  # format C#
dotnet ef migrations add <Name> --project Data --startup-project Api
dotnet ef database update --project Data --startup-project Api
```

### Frontend (from `frontend/`)

```bash
npm run dev       # Vite dev server (HMR)
npm run build     # type-check + production bundle
npm run lint      # ESLint
npm run preview   # serve the production build
```
