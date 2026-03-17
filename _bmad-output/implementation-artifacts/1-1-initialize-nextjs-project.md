# Story 1.1: Initialize Next.js Project

Status: ready-for-dev

## Story

As a developer,
I want a working Next.js application scaffolded with TypeScript, ESLint, and App Router,
so that I have a clean foundation to build the todo application on.

## Acceptance Criteria

1. **Given** the project directory is empty
   **When** the developer runs `npx create-next-app@latest new-project --typescript --eslint --app --turbopack`
   **Then** a Next.js 16.1 project is created with TypeScript, ESLint, and App Router configured

2. **Given** the project has been initialized
   **When** the developer runs `npm run dev`
   **Then** the development server starts without errors (Turbopack)

3. **Given** the project has been initialized
   **When** the developer inspects the project structure
   **Then** `src/app/` exists with `layout.tsx` and `page.tsx`

## Tasks / Subtasks

- [ ] Run project initialization command (AC: #1)
  - [ ] Execute: `npx create-next-app@latest new-project --typescript --eslint --app --turbopack`
  - [ ] When prompted during `create-next-app`, accept all defaults (TypeScript: Yes, ESLint: Yes, Tailwind: No, `src/` dir: Yes, App Router: Yes, Turbopack: Yes, import alias: default `@/*`)
- [ ] Verify development server starts (AC: #2)
  - [ ] Run `npm run dev` inside the `new-project/` directory
  - [ ] Confirm no startup errors in terminal output
  - [ ] Confirm browser opens `http://localhost:3000` with default Next.js welcome page
- [ ] Verify project structure (AC: #3)
  - [ ] Confirm `src/app/layout.tsx` exists
  - [ ] Confirm `src/app/page.tsx` exists
  - [ ] Confirm `src/app/globals.css` exists
  - [ ] Confirm root-level `tsconfig.json`, `next.config.ts`, `.eslintrc.json` exist

## Dev Notes

- **This story is purely a setup story** — no component code, no state, no styling beyond what `create-next-app` generates. Do not add any custom code in this story.
- The `new-project` directory created by `create-next-app` IS the project root for all subsequent stories. All future file paths (e.g. `src/components/`, `src/types/`) are relative to it.
- Accept **all `create-next-app` defaults** — do not deviate from the initialization command or prompts. Tailwind CSS must be **No** (we use CSS Modules per architecture decision).
- `npm run dev` uses Turbopack by default in Next.js 16.1 — this is correct and expected.
- Do **not** modify `src/app/page.tsx` or any generated files in this story — that is deferred to Story 2.x.

### Project Structure Notes

After successful initialization, the project layout should be:

```
new-project/
├── .eslintrc.json           ← ESLint with Next.js recommended config
├── .gitignore
├── next.config.ts
├── next-env.d.ts
├── package.json
├── tsconfig.json            ← TypeScript strict mode (Next.js 16.1 default)
├── public/
│   └── (static assets)
└── src/
    └── app/
        ├── globals.css
        ├── layout.tsx
        └── page.tsx
```

**Future directories** (created in Story 1.2):
- `src/components/` — TodoInput, TodoList, TodoItem
- `src/types/` — `todo.ts` with `Todo` interface
- `src/__tests__/` — test files
- `vitest.config.ts` — Vitest configuration

### Architecture Guardrails — MUST Follow in All Future Stories

These are established in this story's foundation and MUST be respected by all subsequent dev agents:

| Rule | Requirement |
|---|---|
| Component file naming | PascalCase: `TodoItem.tsx`, `TodoList.tsx`, `TodoInput.tsx` |
| CSS Module naming | Match component: `TodoItem.module.css` |
| Props interfaces | `I` prefix: `ITodoItemProps`, `ITodoListProps` |
| Exports | Named exports ONLY — no default exports |
| State updates | Immutable: spread / `.map()` / `.filter()` |
| Test location | `src/__tests__/`, NOT co-located with components |
| Event handler props | `on` prefix: `onDelete`, `onToggle`, `onEdit` |
| Handler implementations | `handle` prefix: `handleDelete`, `handleToggle` |
| ID generation | `crypto.randomUUID()` — no external UUID libraries |
| Import alias | `@/*` maps to `src/*` |

### References

- Initialization command: [Source: architecture.md#Starter Template Evaluation]
- Project structure: [Source: architecture.md#Complete Project Directory Structure]
- Naming conventions: [Source: architecture.md#Naming Patterns]
- Export patterns: [Source: architecture.md#Export Patterns]
- State management patterns: [Source: architecture.md#State Management Patterns]

## Dev Agent Record

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent upon completion -->

### File List

<!-- To be filled by dev agent — list every file created or modified -->
