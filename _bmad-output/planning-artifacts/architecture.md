---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: [product-brief-new-project-2026-03-12.md, prd.md]
workflowType: 'architecture'
project_name: 'new-project'
user_name: 'Rahul'
date: '2026-03-16'
lastStep: 8
status: 'complete'
completedAt: '2026-03-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Create: Add new todos with a title via input form
- Read: Display list of all todos with completion status
- Update: Edit todo titles inline; toggle completion status
- Delete: Remove todos from the list
- All operations are local/client-side with immediate UI feedback

**Non-Functional Requirements:**
- Responsive design: functional and visually polished from 320px mobile to 1440px+ desktop
- Zero external runtime dependencies beyond Next.js/React
- Clean, idiomatic code patterns suitable as a learning reference
- Intuitive UI requiring no instructions

**Scale & Complexity:**

- Primary domain: Frontend Web (Next.js SPA)
- Complexity level: Low
- Estimated architectural components: 3-4 (page, input, list, item)

### Technical Constraints & Dependencies

- Framework: Next.js with React
- State management: React useState only (no Redux, Zustand, etc.)
- No backend or API layer for MVP
- No database or persistence for MVP (localStorage is post-MVP)
- No authentication

### Cross-Cutting Concerns Identified

- Responsive layout strategy across all components
- Consistent component composition patterns (props, callbacks)
- Inline editing UX pattern (shared across TodoItem interactions)

## Starter Template Evaluation

### Primary Technology Domain

Web Application (Next.js SPA) based on project requirements — pure frontend CRUD app with local state management.

### Starter Options Considered

1. **create-next-app (Official)** — The standard Next.js scaffolding tool. Lightweight, maintained by Vercel, covers exactly what this project needs.
2. **T3 Stack (create-t3-app)** — Full-stack starter with tRPC, Prisma, NextAuth. Overkill for a local-state todo app with no backend.
3. **with-vitest example template** — Official Next.js example with Vitest pre-configured. Could save testing setup time but locks into a specific example structure.

### Selected Starter: create-next-app (Next.js 16.1)

**Rationale for Selection:**
The official starter is the right fit — it provides a clean, minimal foundation without unnecessary complexity. For a learning project, starting from the standard scaffolding means the code patterns are transferable and well-documented. Testing (Vitest) will be added manually after initialization to keep full control over the configuration.

**Initialization Command:**

```bash
npx create-next-app@latest new-project --typescript --eslint --app --turbopack
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript with Next.js 16.1 default tsconfig. Strict mode enabled.

**Styling Solution:**
CSS Modules (Next.js default). No additional CSS framework — keeps the learning focus on fundamentals.

**Build Tooling:**
Turbopack for development (fast refresh), Webpack for production builds. ESLint with Next.js recommended config.

**Testing Framework:**
Vitest + React Testing Library (to be added post-initialization). Chosen for speed, native TypeScript support, and simpler configuration with modern Next.js.

**Code Organization:**
App Router structure with `app/` directory. `@/*` import alias for clean imports.

**Development Experience:**
Hot reloading via Turbopack, TypeScript type checking, ESLint integration.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Component architecture pattern (flat structure)
- Data flow pattern (props drilling)
- Client/Server component boundary

**Important Decisions (Shape Architecture):**
- Type strategy (shared types file)

**Deferred Decisions (Post-MVP):**
- localStorage persistence strategy
- Filter state management
- Backend API integration approach

### Data Architecture

No database or persistence layer for MVP. Todo data lives entirely in React component state as an in-memory array. Post-MVP, localStorage persistence will be added as a side effect of state changes.

### Authentication & Security

Not applicable for MVP. No user data, no server communication, no sensitive information.

### API & Communication Patterns

Not applicable for MVP. All operations are local/client-side. No API layer exists.

### Frontend Architecture

**Component Architecture: Flat Structure**
- All components in `src/components/` directory
- Files: `TodoInput.tsx`, `TodoList.tsx`, `TodoItem.tsx`
- Rationale: 3-4 components don't warrant feature folders or atomic design. Flat is simple, discoverable, and idiomatic for this scale.

**Data Flow: Props Drilling**
- Page component owns all state via `useState`
- State and callbacks passed down through props
- No Context API or external state management
- Rationale: With a max depth of 3 components, props drilling is explicit, easy to trace, and teaches fundamental React data flow.

**Type Strategy: Shared Types File**
- Central `src/types/todo.ts` defining the `Todo` interface
- Imported by all components that handle todo data
- Rationale: The Todo type is cross-cutting — sharing it avoids duplication and ensures consistency.

**Client/Server Component Boundary: Single Boundary**
- Page layout can remain a Server Component
- A single `"use client"` directive on the main todo container component
- All interactive children (TodoInput, TodoList, TodoItem) inherit the client boundary
- Rationale: Simplest approach — one boundary, no confusion about which components are server vs client.

### Infrastructure & Deployment

No deployment target for MVP. Development-only with `next dev`. No CI/CD, monitoring, or scaling decisions needed at this stage.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize project with create-next-app
2. Set up shared types (`Todo` interface)
3. Build components bottom-up: TodoItem → TodoList → TodoInput
4. Wire state and props in page component
5. Add Vitest + testing

**Cross-Component Dependencies:**
- All components depend on the shared `Todo` type
- TodoList depends on TodoItem
- Page component orchestrates all state and passes to TodoInput and TodoList

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
7 areas where AI agents could make different choices, all resolved below.

### Naming Patterns

**Component File Naming:**
- PascalCase for all React component files: `TodoItem.tsx`, `TodoList.tsx`, `TodoInput.tsx`
- CSS Modules match their component: `TodoItem.module.css`
- Non-component files use camelCase: `todo.ts` (types)

**Interface & Type Naming:**
- Props interfaces use `I` prefix: `ITodoItemProps`, `ITodoListProps`, `ITodoInputProps`
- Domain types use PascalCase without prefix: `Todo`

**Variable & Function Naming:**
- camelCase for all variables and functions: `handleDelete`, `toggleComplete`, `todoList`
- Event handler props prefixed with `on`: `onDelete`, `onToggle`, `onEdit`
- Handler implementations prefixed with `handle`: `handleDelete`, `handleToggle`

### Structure Patterns

**Test Organization:**
- Tests live in a separate `src/__tests__/` directory, not co-located
- Test files mirror component names: `__tests__/TodoItem.test.tsx`
- Test structure: Arrange-Act-Assert pattern

**Project Organization:**
- Components: `src/components/`
- Types: `src/types/`
- Tests: `src/__tests__/`
- Styles: CSS Modules co-located with components in `src/components/`

### State Management Patterns

**Immutable State Updates:**
- Always use spread operator or `.map()`/`.filter()` for state updates
- Never mutate state directly
- Examples:
  - Add: `setTodos(prev => [...prev, newTodo])`
  - Delete: `setTodos(prev => prev.filter(t => t.id !== id))`
  - Update: `setTodos(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t))`
  - Toggle: `setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))`

### Export Patterns

**Named Exports Only:**
- All components use named exports: `export function TodoItem() {}`
- No default exports
- Import style: `import { TodoItem } from '@/components/TodoItem'`

### Error Handling Patterns

**Input Validation:**
- Prevent submission of empty or whitespace-only titles (disable submit button)
- On edit cancel, revert to previous value — no error messages needed
- No toast notifications or error modals at this scale

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow PascalCase for component files and CSS Modules
- Use `I` prefix for all props interfaces
- Use named exports exclusively — no default exports
- Use immutable state update patterns — never mutate state directly
- Place tests in `src/__tests__/`, not co-located with components
- Prefix event handler props with `on`, implementations with `handle`

## Project Structure & Boundaries

### Complete Project Directory Structure

```
new-project/
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── next-env.d.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── public/
│   └── (static assets)
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── TodoInput.tsx
│   │   ├── TodoInput.module.css
│   │   ├── TodoList.tsx
│   │   ├── TodoList.module.css
│   │   ├── TodoItem.tsx
│   │   └── TodoItem.module.css
│   ├── types/
│   │   └── todo.ts
│   └── __tests__/
│       ├── TodoInput.test.tsx
│       ├── TodoList.test.tsx
│       └── TodoItem.test.tsx
```

### Architectural Boundaries

**Component Boundaries:**
- `page.tsx` (Server Component) — renders layout, imports the client boundary
- `TodoInput` — owns input form state only (controlled input). Calls `onAdd` prop to notify parent.
- `TodoList` — pure rendering component. Receives `todos` array and callbacks, maps to `TodoItem` components.
- `TodoItem` — owns inline edit state only (editing mode, draft text). Calls `onEdit`, `onDelete`, `onToggle` props to notify parent.

**State Boundaries:**
- Global todo state: owned by `page.tsx` via `useState<Todo[]>`
- Local input state: owned by `TodoInput` (current input text)
- Local edit state: owned by `TodoItem` (editing mode flag, draft edit text)

**Data Boundaries:**
- No external data sources for MVP
- All data lives in React component state (in-memory)
- Data shape defined by `Todo` interface in `src/types/todo.ts`

### Requirements to Structure Mapping

**Feature Mapping:**

| Requirement | Component(s) | File(s) |
|---|---|---|
| Add todo | TodoInput | `src/components/TodoInput.tsx` |
| Display todos | TodoList, TodoItem | `src/components/TodoList.tsx`, `TodoItem.tsx` |
| Edit todo title | TodoItem | `src/components/TodoItem.tsx` |
| Toggle complete | TodoItem | `src/components/TodoItem.tsx` |
| Delete todo | TodoItem | `src/components/TodoItem.tsx` |
| State orchestration | Page | `src/app/page.tsx` |
| Responsive layout | All components | `*.module.css` files |

**Cross-Cutting Concerns:**
- `Todo` type: `src/types/todo.ts` — imported by page and all components
- Global styles / CSS reset: `src/app/globals.css`
- Responsive breakpoints: defined in each component's CSS Module

### Data Flow

```
page.tsx (state owner)
  ├── TodoInput
  │     ↑ onAdd(title)
  │     └── local: inputText
  └── TodoList (todos, onEdit, onDelete, onToggle)
        └── TodoItem (todo, onEdit, onDelete, onToggle)
              ↑ onEdit(id, newTitle), onDelete(id), onToggle(id)
              └── local: isEditing, draftText
```

### File Organization Patterns

**Configuration Files:** Root level — `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `.eslintrc.json`
**Source Organization:** All source under `src/` — `app/` for Next.js routing, `components/` for UI, `types/` for shared interfaces
**Test Organization:** `src/__tests__/` with one test file per component
**Asset Organization:** `public/` for static assets (favicon, images if needed)

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are fully compatible — Next.js 16.1 + TypeScript + CSS Modules + Vitest is a well-tested, mainstream combination with no version conflicts.

**Pattern Consistency:**
Naming conventions (PascalCase components, `I` prefix interfaces, `on`/`handle` event handler convention) are consistent across all areas. Immutable state update patterns align with React best practices and useState requirements.

**Structure Alignment:**
Project structure directly supports all architectural decisions — flat components directory for 3 components, shared types directory, separate test directory, CSS Modules co-located with components.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| Requirement | Architecture Support | Component(s) |
|---|---|---|
| Add todo | ✅ Fully supported | TodoInput → onAdd → page state |
| Display todos | ✅ Fully supported | TodoList + TodoItem rendering |
| Edit todo title | ✅ Fully supported | TodoItem inline edit → onEdit → page state |
| Toggle complete | ✅ Fully supported | TodoItem → onToggle → page state |
| Delete todo | ✅ Fully supported | TodoItem → onDelete → page state |
| Responsive design | ✅ Fully supported | CSS Modules per component, 320px–1440px+ |

**Non-Functional Requirements Coverage:**
- ✅ Zero external runtime deps — useState only, no backend, no external state libraries
- ✅ Clean code patterns — composition, props drilling, named exports, shared types
- ✅ Intuitive UI — input validation prevents empty submissions, edit cancel reverts gracefully

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions are documented with specific technology versions. State update examples are provided for every CRUD operation. No ambiguity remains for implementing agents.

**Structure Completeness:**
Complete project tree with every file and directory specified. Component boundaries, state ownership, and data flow are explicitly mapped.

**Pattern Completeness:**
All 7 identified conflict points are resolved with concrete rules and examples. ID generation strategy specified: `crypto.randomUUID()`.

### Gap Analysis Results

**Critical Gaps:** None
**Important Gaps:** None
**Minor Gaps Resolved:**
- ID generation strategy: resolved — use `crypto.randomUUID()` for new todo IDs

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Data flow patterns defined
- [x] Component boundaries established

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] State management patterns specified with examples
- [x] Error handling and validation patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Requirements to structure mapping complete
- [x] Data flow diagram provided

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — low-complexity project with clear, complete decisions and no ambiguity.

**Key Strengths:**
- Every architectural decision maps directly to a project requirement
- State update examples cover all four CRUD operations explicitly
- Component boundaries and data flow are unambiguous
- Consistency rules prevent AI agent divergence on all identified conflict points

**Areas for Future Enhancement (Post-MVP):**
- localStorage persistence strategy
- Filter state management pattern
- Backend API integration approach

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Use `crypto.randomUUID()` for generating todo IDs
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npx create-next-app@latest new-project --typescript --eslint --app --turbopack
```
