# Story 1.2: Configure Testing and Project Structure

Status: ready-for-dev

## Story

As a developer,
I want Vitest and React Testing Library configured with the project's directory structure in place,
so that I can write and run tests as I build components.

## Acceptance Criteria

1. **Given** the Next.js project from Story 1.1 is initialized
   **When** Vitest and React Testing Library are installed and configured
   **Then** `vitest.config.ts` exists at the project root with proper Next.js/React configuration

2. **Given** the testing infrastructure is in place
   **When** the developer inspects the project
   **Then** `src/types/todo.ts` exists with the `Todo` interface: `id: string`, `title: string`, `completed: boolean`

3. **Given** the testing infrastructure is in place
   **When** the developer inspects the project
   **Then** `src/__tests__/` directory exists

4. **Given** the testing infrastructure is in place
   **When** the developer inspects the project
   **Then** `src/components/` directory exists

5. **Given** a sample test exists in `src/__tests__/`
   **When** the developer runs `npx vitest run`
   **Then** the test suite completes successfully with no errors

## Tasks / Subtasks

- [ ] Install Vitest and React Testing Library dependencies (AC: #1)
  - [ ] Run: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
  - [ ] Confirm all packages appear in `devDependencies` in `package.json`
- [ ] Create `vitest.config.ts` at project root (AC: #1)
  - [ ] Create file with the exact configuration shown in Dev Notes below
- [ ] Create `src/types/todo.ts` with the `Todo` interface (AC: #2)
  - [ ] Define interface with exactly: `id: string`, `title: string`, `completed: boolean`
  - [ ] Use named export: `export interface Todo { ... }`
- [ ] Create `src/components/` directory (AC: #4)
  - [ ] Create a `.gitkeep` file (or add a placeholder comment) to ensure directory is tracked
  - [ ] Do NOT create any component files yet — that is for Epic 2 stories
- [ ] Create `src/__tests__/` directory (AC: #3)
  - [ ] Create a sample test file `src/__tests__/setup.test.ts` (see Dev Notes for content)
- [ ] Verify tests pass (AC: #5)
  - [ ] Run `npx vitest run`
  - [ ] Confirm sample test passes with no errors

## Dev Notes

### `vitest.config.ts` — Exact Configuration

Create this file at the project root (`new-project/vitest.config.ts`):

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Why jsdom:** All components are client-side React — jsdom simulates the browser DOM without needing a real browser.

**Why globals: true:** Allows using `describe`, `it`, `expect` without importing them in each test file — matches Vitest's recommended config for React projects.

**Why the `@` alias:** Mirrors Next.js's `@/*` → `src/*` alias from `tsconfig.json` so test files can use the same import paths as components.

### `src/types/todo.ts` — Exact Content

```ts
export interface Todo {
  id: string
  title: string
  completed: boolean
}
```

**Critical rules:**
- Named export only — `export interface`, NOT `export default`
- No extra fields — do not add `createdAt`, `updatedAt`, or any other fields at this stage
- This interface is the single source of truth imported by `page.tsx`, `TodoInput`, `TodoList`, `TodoItem`

### Sample Test — `src/__tests__/setup.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import type { Todo } from '@/types/todo'

describe('Todo type', () => {
  it('can create a valid todo object', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test todo',
      completed: false,
    }
    expect(todo.id).toBe('1')
    expect(todo.title).toBe('Test todo')
    expect(todo.completed).toBe(false)
  })
})
```

This test validates the `Todo` type is correctly defined and importable via the `@/*` alias.

### Project Structure After This Story

```
new-project/
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── next-env.d.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts          ← NEW
├── public/
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/           ← NEW (empty, placeholder only)
    ├── types/
    │   └── todo.ts           ← NEW
    └── __tests__/
        └── setup.test.ts     ← NEW (sample test)
```

### Dependency Versions (from architecture decision)

- `vitest` — latest stable (^3.x at time of writing)
- `@vitejs/plugin-react` — required for JSX transform in tests
- `jsdom` — DOM simulation for React Testing Library
- `@testing-library/react` — React component testing utilities
- `@testing-library/jest-dom` — extra DOM matchers (`.toBeInTheDocument()`, etc.)
- `@testing-library/user-event` — simulates real user interactions (typing, clicking)

All installed as `devDependencies` — zero impact on production bundle size.

### Previous Story Context (Story 1.1)

- Working directory for all commands: `new-project/` (the directory created by `create-next-app`)
- TypeScript strict mode is already enabled via `tsconfig.json`
- `@/*` import alias is already configured in `tsconfig.json` — `vitest.config.ts` must mirror it using `path.resolve`
- ESLint is already configured — no changes needed to `.eslintrc.json`
- Do NOT modify any `src/app/` files in this story

### Architecture Guardrails — MUST Follow

| Rule | Requirement |
|---|---|
| Exports | Named exports ONLY — `export interface Todo`, not `export default` |
| Test location | `src/__tests__/` — never co-locate tests with source files |
| Test file naming | Mirror component name: `TodoItem.test.tsx` (for future stories) |
| Import alias | Use `@/types/todo` — not relative paths like `../../types/todo` |
| No component files yet | `src/components/` is created empty — components are Epic 2 work |

### References

- Testing framework decision: [Source: architecture.md#Starter Template Evaluation]
- Test organization pattern: [Source: architecture.md#Test Organization]
- Project structure: [Source: architecture.md#Complete Project Directory Structure]
- `Todo` interface: [Source: epics.md#Story 1.2 Acceptance Criteria]
- Import alias: [Source: architecture.md#Code Organization]

## Dev Agent Record

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent upon completion -->

### File List

<!-- To be filled by dev agent — list every file created or modified -->
