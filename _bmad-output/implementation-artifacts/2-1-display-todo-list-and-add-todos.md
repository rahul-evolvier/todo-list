# Story 2.1: Display Todo List and Add Todos

Status: ready-for-dev

## Story

As a user,
I want to see my todos in a list and add new ones by entering a title,
so that I can start building and viewing my task list.

## Acceptance Criteria

1. **Given** the application is loaded
   **When** the page renders
   **Then** an input field and submit button are displayed for adding todos
   **And** the todo list area is visible (empty state shown when no todos exist)

2. **Given** the user types a title in the input field
   **When** the user submits the form (button click or Enter key)
   **Then** a new todo appears in the list with the entered title and `completed: false`
   **And** the input field is cleared after submission
   **And** the todo has a unique ID generated via `crypto.randomUUID()`

3. **Given** the input field is empty or contains only whitespace
   **When** the user views the form
   **Then** the submit button is disabled (cannot submit)

4. **Given** the app is viewed on a 320px mobile viewport
   **When** the page renders
   **Then** the input field, submit button, and todo list are fully visible and usable without horizontal scrolling

## Tasks / Subtasks

- [ ] Modify `src/app/page.tsx` to own todo state and render components (AC: #1, #2)
  - [ ] Add `"use client"` directive at the top
  - [ ] Import `useState` from React
  - [ ] Import `Todo` type from `@/types/todo`
  - [ ] Declare `const [todos, setTodos] = useState<Todo[]>([])`
  - [ ] Implement `handleAdd(title: string)` — creates new todo via `crypto.randomUUID()`
  - [ ] Render `<TodoInput onAdd={handleAdd} />` and `<TodoList todos={todos} />`
  - [ ] Remove all default Next.js template content from `page.tsx`
- [ ] Create `src/components/TodoInput.tsx` (AC: #1, #2, #3)
  - [ ] Controlled input with local `inputText` state
  - [ ] Submit button disabled when `inputText.trim() === ''`
  - [ ] Calls `onAdd(inputText.trim())` on submit, then clears input
  - [ ] Handles both button click and Enter key (form `onSubmit`)
  - [ ] Named export: `export function TodoInput`
- [ ] Create `src/components/TodoInput.module.css` (AC: #1, #4)
  - [ ] Responsive layout that works at 320px
- [ ] Create `src/components/TodoList.tsx` (AC: #1, #2)
  - [ ] Receives `todos: Todo[]` prop
  - [ ] Maps each todo to a `<TodoItem>` component
  - [ ] Renders an empty-state message when `todos.length === 0`
  - [ ] Named export: `export function TodoList`
- [ ] Create `src/components/TodoList.module.css` (AC: #4)
  - [ ] Responsive layout
- [ ] Create `src/components/TodoItem.tsx` (AC: #1, #2)
  - [ ] Displays `todo.title` and visual completion indicator (`todo.completed`)
  - [ ] Props interface: `ITodoItemProps` — see Dev Notes for full interface
  - [ ] Named export: `export function TodoItem`
  - [ ] NOTE: Interactive handlers (toggle, delete, edit) are added in Stories 2.2–2.4; stubs only in this story
- [ ] Create `src/components/TodoItem.module.css` (AC: #4)
- [ ] Write tests in `src/__tests__/TodoInput.test.tsx` (AC: #1, #2, #3)
  - [ ] Test: renders input field and submit button
  - [ ] Test: submit button is disabled when input is empty
  - [ ] Test: submit button is disabled when input is whitespace only
  - [ ] Test: calls `onAdd` with trimmed value on form submit
  - [ ] Test: clears input field after submission
- [ ] Write tests in `src/__tests__/TodoList.test.tsx` (AC: #1, #2)
  - [ ] Test: renders empty state message when no todos
  - [ ] Test: renders a list item for each todo
  - [ ] Test: renders todo title in each item

## Dev Notes

### `src/app/page.tsx` — Full Implementation

```tsx
"use client"

import { useState } from 'react'
import { TodoInput } from '@/components/TodoInput'
import { TodoList } from '@/components/TodoList'
import type { Todo } from '@/types/todo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])

  function handleAdd(title: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    }
    setTodos(prev => [...prev, newTodo])
  }

  return (
    <main>
      <h1>Todo List</h1>
      <TodoInput onAdd={handleAdd} />
      <TodoList todos={todos} />
    </main>
  )
}
```

**Critical notes:**
- `"use client"` at top — this is required; `page.tsx` uses React hooks
- `crypto.randomUUID()` is a Web API available in all modern browsers and Node.js 14.17+ — no library needed
- `default export` is required for Next.js App Router page files — this is the ONE exception to the named-export rule
- Use `prev => [...prev, newTodo]` for immutable state update — never `todos.push()`

### `src/components/TodoInput.tsx` — Props Interface and Implementation Pattern

```tsx
"use client"

import { useState } from 'react'
import styles from './TodoInput.module.css'

export interface ITodoInputProps {
  onAdd: (title: string) => void
}

export function TodoInput({ onAdd }: ITodoInputProps) {
  const [inputText, setInputText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inputText.trim() === '') return
    onAdd(inputText.trim())
    setInputText('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder="Add a new todo..."
        className={styles.input}
      />
      <button
        type="submit"
        disabled={inputText.trim() === ''}
        className={styles.button}
      >
        Add
      </button>
    </form>
  )
}
```

**Critical notes:**
- Use `<form onSubmit>` — handles both button click AND Enter key automatically
- The `disabled` check must be `inputText.trim() === ''` — whitespace-only must also be blocked
- Call `onAdd(inputText.trim())` — always trim before passing to parent
- Clear input AFTER calling `onAdd`, not before

### `src/components/TodoList.tsx` — Props Interface and Implementation Pattern

```tsx
import { TodoItem } from '@/components/TodoItem'
import type { Todo } from '@/types/todo'
import styles from './TodoList.module.css'

export interface ITodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: ITodoListProps) {
  if (todos.length === 0) {
    return <p className={styles.empty}>No todos yet. Add one above!</p>
  }

  return (
    <ul className={styles.list}>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
```

**Critical notes:**
- No `"use client"` needed — `TodoList` is a pure rendering component with no hooks
- Always use `todo.id` as the React `key` — never use array index as key
- `TodoItem` receives only `todo` for now; callbacks are added in Stories 2.2–2.4

### `src/components/TodoItem.tsx` — Minimal Display for This Story

```tsx
import type { Todo } from '@/types/todo'
import styles from './TodoItem.module.css'

export interface ITodoItemProps {
  todo: Todo
  onToggle?: (id: string) => void   // added in Story 2.2
  onDelete?: (id: string) => void   // added in Story 2.3
  onEdit?: (id: string, newTitle: string) => void  // added in Story 2.4
}

export function TodoItem({ todo }: ITodoItemProps) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <span className={styles.title}>{todo.title}</span>
    </li>
  )
}
```

**Critical notes:**
- Define the full `ITodoItemProps` interface now with optional callbacks — this avoids breaking changes in Stories 2.2–2.4 when handlers are added
- The `completed` style class provides the visual completion indicator (strikethrough, muted color, etc.)
- No `"use client"` needed — no hooks in this version (added in Story 2.4 when inline edit state is needed)

### CSS Module Guidance

**`TodoInput.module.css` — minimum for responsiveness:**
```css
.form {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.input {
  flex: 1;
  min-width: 0; /* critical: prevents flex overflow on small screens */
  padding: 0.5rem;
}

.button {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
}
```

**`TodoItem.module.css` — completion indicator:**
```css
.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.completed .title {
  text-decoration: line-through;
  opacity: 0.5;
}
```

**Responsive requirement:** The `min-width: 0` on `.input` is critical — without it, the flex child will not shrink below its content width, causing horizontal overflow at 320px.

### Test Patterns

**`src/__tests__/TodoInput.test.tsx`:**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from '@/components/TodoInput'
import { describe, it, expect, vi } from 'vitest'

describe('TodoInput', () => {
  it('renders input field and submit button', () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('disables submit button when input is empty', () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('disables submit button when input is whitespace only', async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)
    await user.type(screen.getByRole('textbox'), '   ')
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('calls onAdd with trimmed value on submit', async () => {
    const user = userEvent.setup()
    const handleAdd = vi.fn()
    render(<TodoInput onAdd={handleAdd} />)
    await user.type(screen.getByRole('textbox'), '  Buy milk  ')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(handleAdd).toHaveBeenCalledWith('Buy milk')
  })

  it('clears input after submission', async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(input).toHaveValue('')
  })
})
```

**`src/__tests__/TodoList.test.tsx`:**

```tsx
import { render, screen } from '@testing-library/react'
import { TodoList } from '@/components/TodoList'
import { describe, it, expect } from 'vitest'
import type { Todo } from '@/types/todo'

const mockTodos: Todo[] = [
  { id: '1', title: 'Buy milk', completed: false },
  { id: '2', title: 'Walk the dog', completed: true },
]

describe('TodoList', () => {
  it('renders empty state when no todos', () => {
    render(<TodoList todos={[]} />)
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('renders a list item for each todo', () => {
    render(<TodoList todos={mockTodos} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders each todo title', () => {
    render(<TodoList todos={mockTodos} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })
})
```

**Test setup note:** For `@testing-library/jest-dom` matchers (`.toBeInTheDocument()`, `.toBeDisabled()`, `.toHaveValue()`) to work, add this to `vitest.config.ts`:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/__tests__/setup.ts'],  // ← add this
}
```

And create `src/__tests__/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

This is a required addendum to Story 1.2's `vitest.config.ts` — add it when implementing this story.

### State Architecture — This Story's Scope

```
page.tsx  (owns: todos: Todo[])
  ├── TodoInput  (owns: inputText: string)
  │     ↑ onAdd(title)
  └── TodoList   (todos)
        └── TodoItem (todo)
              [no handlers yet — added in Stories 2.2–2.4]
```

### Previous Story Context (Stories 1.1 and 1.2)

- `src/types/todo.ts` with `Todo` interface already exists — import, do not redefine
- `vitest.config.ts` exists — needs `setupFiles` addition (see test setup note above)
- `src/components/` and `src/__tests__/` directories exist (empty)
- `@/` alias resolves to `src/` in both Next.js and Vitest

### Architecture Guardrails — MUST Follow

| Rule | Requirement |
|---|---|
| Exports | Named exports for all components — `export function TodoInput`, `export function TodoList`, `export function TodoItem` |
| Exception | `page.tsx` uses `export default function Home()` — required by Next.js App Router |
| Props interfaces | `I` prefix: `ITodoInputProps`, `ITodoListProps`, `ITodoItemProps` |
| State updates | `setTodos(prev => [...prev, newTodo])` — spread, never push |
| ID generation | `crypto.randomUUID()` — no library |
| CSS | CSS Modules only — no inline styles, no Tailwind |
| Event handlers | Props: `onAdd`, `onToggle`, `onDelete`, `onEdit` / Implementations: `handleAdd`, `handleSubmit` |
| Test files | `src/__tests__/` only — never co-located with components |
| React key | Always `todo.id` — never array index |

### References

- Component architecture: [Source: architecture.md#Frontend Architecture]
- Data flow diagram: [Source: architecture.md#Data Flow]
- Component boundaries: [Source: architecture.md#Architectural Boundaries]
- Naming conventions: [Source: architecture.md#Naming Patterns]
- State update examples: [Source: architecture.md#State Management Patterns]
- Story requirements: [Source: epics.md#Story 2.1]

## Dev Agent Record

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent upon completion -->

### File List

<!-- To be filled by dev agent — list every file created or modified -->
