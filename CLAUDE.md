# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Shopping Assistant — a full-stack application with:
- **Backend**: ASP.NET Core Web API (.NET 10), PostgreSQL, Entity Framework Core, OpenAI-powered agentic cart analysis
- **Frontend**: React 19 + TypeScript (Vite), MUI v9, React Router v7

## Commands

### Backend (run from `backend/`)

```bash
# Run the API (http://localhost:5211, swagger at /swagger)
dotnet run --project Api

# Build the solution
dotnet build backend.slnx

# Format C# code (requires dotnet tool restore first)
dotnet tool restore
dotnet csharpier .

# Add EF Core migration
dotnet ef migrations add <MigrationName> --project Data --startup-project Api

# Apply migrations
dotnet ef database update --project Data --startup-project Api
```

### Frontend (run from `frontend/`)

```bash
npm run dev        # start Vite dev server
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
```

The frontend reads `VITE_API_URL` from the environment (`.env` or `.env.local`) to locate the backend — e.g. `VITE_API_URL=http://localhost:5211/api`.

## Architecture

### Backend — three-project solution (`backend.slnx`)

```
Api/        ← ASP.NET Core entry point: controllers, DI wiring, OpenAI config
Logic/      ← Services, DTOs, AI agents, tools (no EF references)
Data/       ← EF Core DbContext, entities, repositories, migrations, seeders
```

**Request flow**: Controller → `IXxxService` (Logic) → `IXxxRepository` (Data) → PostgreSQL.

**AI agents** (`Logic/Agents/`): Two `Microsoft.Agents.AI` `ChatClientAgent` instances wired into a sequential `WorkflowBuilder` pipeline inside `CartService.AnalyzeCartAsync`:
1. `PromotionCheckerAgent` — evaluates active/near-miss promotions using the `GetPromotionsForProduct` AI tool.
2. `SuggestionComposerAgent` — receives the previous agent's output and calls `SearchProducts` / `GetProductsByCategory` tools to compose up to 5 product suggestions.

OpenAI is **optional**: if `OpenAI:ApiKey` is absent in config, both agents fall back to `UnavailableXxxAgent` stubs that return an error payload. Configure via user secrets or environment variables:
```bash
dotnet user-secrets set "OpenAI:ApiKey" "sk-..."  # from Api/ project
dotnet user-secrets set "OpenAI:ModelId" "gpt-4o"
```

**Database seeding** runs automatically on startup via `DatabaseSeeder`; seeders are idempotent.

**EF Core schema**: all tables live in the `smart_shopping_assistant` PostgreSQL schema. Configurations are in `Data/Configurations/` using `IEntityTypeConfiguration<T>`.

### Frontend — feature-oriented structure under `src/`

```
api/
  base/http.ts          ← axios instance (reads VITE_API_URL)
  client/               ← one typed client per domain (products, categories, promotions, cart)
  models/               ← raw DTO shapes from the API
shared/
  types/                ← domain types with mapping functions (e.g. toProduct)
  format/               ← formatting utilities (currency, etc.)
themes/                 ← MUI theme definition
components/             ← one folder per page/feature; hooks live inside each folder
```

**API layer pattern**: raw DTO types in `api/models/` are mapped to clean domain types in `shared/types/` via `toXxx` mapper functions. API clients call `http.get/post/put/remove` and return domain types — pages never reference DTO shapes directly.

**Routing** (`App.tsx`): `/` → Home, `/products`, `/categories`, `/promotions`, `/cart`.

**Path alias**: `@/` maps to `src/` (configured in `vite.config.ts`).
