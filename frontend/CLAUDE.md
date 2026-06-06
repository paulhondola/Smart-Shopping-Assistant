# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite HMR)
npm run build        # Type-check then bundle for production
npm run lint         # ESLint
npm run preview      # Serve the production build locally
```

The backend must be running at `http://localhost:5211` (set via `VITE_API_URL` in `.env`).

## Architecture

**Stack**: React 19 + TypeScript + Vite, MUI v9, React Router v7, Axios.

### Layer overview

```
src/
├── api/
│   ├── base/http.ts          — Axios instance; normalizes error messages; typed get/post/put/remove helpers
│   ├── models/               — Raw DTO interfaces (*GetDto, *CreateDto, *UpdateDto) matching the backend contract
│   └── client/               — API clients (productsApi, categoriesApi, promotionsApi) that call http.* and map DTOs → domain types
├── shared/
│   ├── types/                — Domain types (Product, Category, Promotion) with to* mapper functions
│   └── format/currency.ts    — RON formatter (ro-RO locale, Intl.NumberFormat)
├── themes/theme.ts            — MUI dark theme (primary #c96442, background #141413)
└── components/
    ├── common/               — Shared: PageHeader, ConfirmDialog
    ├── ui/                   — Primitive UI atoms (e.g. button.tsx)
    └── <Feature>/            — One directory per page/feature (see below)
```

### Feature component pattern

Every data-management page (`Products`, `Categories`, `Promotions`) follows this internal structure:

```
<Feature>/
├── index.tsx              — Page: owns fetch/CRUD state, renders table + dialogs
├── <Feature>FilterBar/    — Filter UI (receives filters + callbacks as props)
├── <Feature>FormDialog/   — Create/edit MUI Dialog
└── hooks/use<Feature>Filters.ts  — Filter state + useMemo-derived filtered list + activeFilterCount
```

The `Home` page is composed differently — it uses `sections/`, `parts/`, and `hooks/` subdirectories.

### DTO ↔ Domain type separation

API models (`src/api/models/`) are kept separate from domain types (`src/shared/types/`). Each domain type file exports a `to*` mapper (e.g. `toProduct`, `toCategory`) that converts a DTO into the domain shape. API clients always call these mappers before returning data to components.

### Path alias

`@` resolves to `src/`. Use `@/api/...`, `@/shared/...`, etc. for imports outside the immediate component tree.

### Currency

All monetary values are Romanian RON. Use `formatRON` from `src/shared/format/currency.ts` for display; use `.toLocaleString("ro-RO", { style: "currency", currency: "RON" })` only as an inline fallback.
