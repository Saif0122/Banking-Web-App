# Apex Bank Frontend Architecture

A production-ready, highly-scalable, and beautifully-designed digital banking application frontend.

## Tech Stack

- **Framework**: [Next.js 15 App Router](https://nextjs.org/) (React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Queries**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Themes**: [Next Themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Directory Structure

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router (Layouts & Pages)
│   │   ├── (auth)/             # Authentication route group (Login/Register)
│   │   ├── (dashboard)/        # User application group (Dashboard, Accounts, Analytics)
│   │   ├── (admin)/            # Administration panel (Restricted admin workspace)
│   │   ├── globals.css         # Tailwind CSS v4 variables and custom declarations
│   │   ├── layout.tsx          # Root Layout & Context wrappers
│   │   └── page.tsx            # Entrypoint routing redirector
│   │
│   ├── components/             # Reusable UI & Layout components
│   │   ├── ui/                 # Atomic design tokens (Buttons, Inputs, Cards)
│   │   ├── shared/             # Cross-cutting components (ThemeToggle, Modals)
│   │   ├── forms/              # Reusable form blocks
│   │   ├── dashboard/          # Dashboard-specific UI elements
│   │   ├── accounts/           # Accounts-specific UI elements
│   │   ├── transactions/       # Transactions table sheets
│   │   └── admin/              # Admin-specific modules
│   │
│   ├── features/               # Module-based business logic (State, API Hooks)
│   │   ├── auth/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   ├── dashboard/
│   │   └── admin/
│   │
│   ├── hooks/                  # Global custom React hooks
│   ├── lib/                    # SDK clients, utility mergers (e.g. cn.ts)
│   ├── services/               # Core API fetch client wrappers
│   ├── providers/              # React Context Providers (Query, Theme, Auth)
│   ├── types/                  # Global domain TypeScript interfaces
│   ├── constants/              # System navigation, route paths mapping
│   ├── schemas/                # Zod schemas (Forms, Inputs validation)
│   └── store/                  # Client-side global store interface placeholders
│
├── .env.local                  # Environment variables template
├── .prettierrc                 # Code formatting layout definitions
├── eslint.config.mjs           # Flat ESLint rules configuration
└── tsconfig.json               # Absolute imports configure file mapping
```

---

## Configuration Details

### 1. Absolute Imports
Absolute imports are pre-configured through `@/*` aliases mapping to the `src/*` folder.
Example:
```typescript
import { ROUTES } from "@/constants";
import { useAuth } from "@/providers/auth-provider";
```

### 2. Flat ESLint & Prettier
ESLint flat configuration (`eslint.config.mjs`) is combined with Prettier settings using `eslint-config-prettier` to eliminate spacing and format rule warnings during linting phases.

### 3. Tailwind CSS v4 Theme System
The global styles are implemented under `src/app/globals.css` using the new Tailwind v4 specification. Theme configurations use native CSS Custom Variables for dynamic Light/Dark switching:
- **Light Theme**: Soft slate/cool blue gradients (`220 33% 98%` background).
- **Dark Theme**: Dark navy premium theme canvas (`224 71% 4%` background).

---

## Authentication & Route Protections

1. **Root Layout**: Wraps the document tree inside `ThemeProvider`, `QueryProvider`, and `AuthProvider`.
2. **Auth Guard**: Checked inside layouts:
   - `DashboardLayout` redirects anonymous users back to the `/login` screen.
   - `AdminLayout` blocks non-administrative accounts, routing them back to the user `/dashboard` screen.

---

## Running Commands

Navigate to the `frontend/` directory:

### Start Development Server
```bash
npm run dev
```

### Compile Production Build
```bash
npm run build
```

### Run ESLint Checks
```bash
npm run lint
```

### Format Code with Prettier
```bash
npx prettier --write .
```
