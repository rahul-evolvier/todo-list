# Story 2.2: Toggle Todo Completion

Status: ready-for-dev

## Story

As a user,
I want to mark a todo as complete or incomplete,
so that I can track which tasks are done.

## Acceptance Criteria

1. **Given** a todo exists in the list with `completed: false`
   **When** the user clicks the toggle control
   **Then** the todo's `completed` status changes to `true`
   **And** the todo visually indicates completion (strikethrough + reduced opacity)

2. **Given** a todo exists in the list with `completed: true`
   **When** the user clicks the toggle control
   **Then** the todo's `completed` status changes to `false`
   **And** the completion visual indicator is removed

## Tasks / Subtasks

- [ ] Update `src/app/page.tsx` — add `handleToggle` and pass it down (AC: #1, #2)
  - [ ] Implement `handleToggle(id: string)` using immutable map pattern
  - [ ] Pass `onToggle={handleToggle}` to `<TodoList>`
- [ ] Update `src/components/TodoList.tsx` — thread `onToggle` through to `TodoItem` (AC: #1, #2)
  - [ ] Add `onToggle` to `ITodoListProps`
  - [ ] Pass `onToggle` to each `<TodoItem>`
- [ ] Update `src/components/TodoItem.tsx` — add toggle control (AC: #1, #2)
  - [ ] Make `onToggle` a required prop (was optional in Story 2.1 stub)
  - [ ] Add a checkbox input bound to `todo.completed`
  - [ ] Call `onToggle(todo.id)` on change
  - [ ] Apply `.completed` CSS class when `todo.completed` is true
- [ ] Update `src/components/TodoItem.module.css` — ensure completion styling is in place (AC: #1, #2)
  - [ ] `.completed .title` → `text-decoration: line-through; opacity: 0.5`
- [ ] Write tests in `src/__tests__/TodoItem.test.tsx` (AC: #1, #2)
  - [ ] Test: renders a checkbox for each todo
  - [ ] Test: checkbox is unchecked when `completed: false`
  - [ ] Test: checkbox is checked when `completed: true`
  - [ ] Test: calls `onToggle` with the correct `id` when checkbox is clicked
  - [ ] Test: completed todo has visual indicator (strikethrough class or aria)

## Dev Notes

### `src/app/page.tsx` — Add `handleToggle`

Add this function alongside `handleAdd`, then pass it to `<TodoList>`:

```tsx
function handleToggle(id: string) {
  setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
}

// In JSX:
<TodoList todos={todos} onToggle={handleToggle} />
```

**State update pattern:** `prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)`
- Never `t.completed = !t.completed` — that mutates state directly
- Spread `{ ...t }` first, then override `completed`
- All non-matching todos pass through unchanged

### `src/components/TodoList.tsx` — Updated Props

```tsx
import { TodoItem } from '@/components/TodoItem'
import type { Todo } from '@/types/todo'
import styles from './TodoList.module.css'

export interface ITodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void   // ← added
}

export function TodoList({ todos, onToggle }: ITodoListProps) {
  if (todos.length === 0) {
    return <p className={styles.empty}>No todos yet. Add one above!</p>
  }

  return (
    <ul className={styles.list}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}
```

**Note:** `onToggle` becomes required on `ITodoListProps` in this story. The Story 2.1 implementation stub only had it on `ITodoItemProps` as optional — update both.

### `src/components/TodoItem.tsx` — Add Toggle Control

```tsx
import type { Todo } from '@/types/todo'
import styles from './TodoItem.module.css'

export interface ITodoItemProps {
  todo: Todo
  onToggle: (id: string) => void    // required now
  onDelete?: (id: string) => void   // still optional — Story 2.3
  onEdit?: (id: string, newTitle: string) => void  // still optional — Story 2.4
}

export function TodoItem({ todo, onToggle }: ITodoItemProps) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span className={styles.title}>{todo.title}</span>
    </li>
  )
}
```

**Why `<input type="checkbox">`:**
- Semantic — screen readers understand checked/unchecked state natively
- `checked` is a controlled prop bound to `todo.completed` — React owns the state, not the DOM
- `onChange` (not `onClick`) is the correct React event for checkbox inputs
- `aria-label` provides accessible context for screen readers

**No `"use client"` needed:** `TodoItem` has no local hooks in this story. It inherits the client boundary from `page.tsx`.

### `src/components/TodoItem.module.css` — Completion Styles

```css
.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.title {
  flex: 1;
}

.completed .title {
  text-decoration: line-through;
  opacity: 0.5;
}
```

**How it works:** When `todo.completed` is true, the `<li>` gets both `styles.item` and `styles.completed`. The descendant selector `.completed .title` applies the strikethrough to the `<span>`.

### Test Patterns — `src/__tests__/TodoItem.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '@/components/TodoItem'
import { describe, it, expect, vi } from 'vitest'
import type { Todo } from '@/types/todo'

const incompleteTodo: Todo = { id: '1', title: 'Buy milk', completed: false }
const completedTodo: Todo = { id: '2', title: 'Walk dog', completed: true }

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('renders a checkbox', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('checkbox is unchecked when todo is incomplete', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked when todo is completed', () => {
    render(<TodoItem todo={completedTodo} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={handleToggle} />)
    await user.click(screen.getByRole('checkbox'))
    expect(handleToggle).toHaveBeenCalledOnce()
    expect(handleToggle).toHaveBeenCalledWith('1')
  })
})
```

**Update `src/__tests__/TodoList.test.tsx`:** The `onToggle` prop is now required — update existing tests to pass it:

```tsx
render(<TodoList todos={mockTodos} onToggle={vi.fn()} />)
```

### Data Flow for This Story

```
page.tsx
  handleToggle(id) → setTodos(prev => prev.map(...toggle...))
      ↓ onToggle={handleToggle}
  TodoList
      ↓ onToggle={onToggle}
  TodoItem
      checkbox onChange → onToggle(todo.id)
```

### Previous Story Context (Story 2.1)

- `ITodoItemProps` already declares `onToggle?: (id: string) => void` — promote it from optional to required
- `TodoItem.module.css` already has `.completed` class stub — flesh out the styles
- `page.tsx` already owns `todos: Todo[]` state — add `handleToggle` alongside `handleAdd`
- `TodoList` already maps todos to `TodoItem` — thread the new prop through

### Architecture Guardrails — MUST Follow

| Rule | Requirement |
|---|---|
| State update | `prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)` — immutable |
| Checkbox event | `onChange` — not `onClick` for checkbox inputs |
| Controlled input | `checked={todo.completed}` — React controls state, not DOM |
| No `"use client"` on TodoItem | Inherits boundary from page.tsx — no local hooks needed |
| Props interface | `ITodoItemProps`, `ITodoListProps` — keep `I` prefix |
| `onToggle` naming | Prop: `onToggle` / Handler: `handleToggle` — follow on/handle convention |

### References

- Toggle state update example: [Source: architecture.md#State Management Patterns]
- Component boundaries: [Source: architecture.md#Architectural Boundaries]
- Data flow: [Source: architecture.md#Data Flow]
- Story requirements: [Source: epics.md#Story 2.2]

## Dev Agent Record

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent upon completion -->

### File List

<!-- To be filled by dev agent — list every file created or modified -->
