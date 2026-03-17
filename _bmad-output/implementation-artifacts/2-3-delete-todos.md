# Story 2.3: Delete Todos

Status: ready-for-dev

## Story

As a user,
I want to delete a todo,
so that I can remove tasks I no longer need.

## Acceptance Criteria

1. **Given** a todo exists in the list
   **When** the user clicks the delete button
   **Then** the todo is immediately removed from the list
   **And** the remaining todos are still displayed correctly

2. **Given** only one todo exists in the list
   **When** the user deletes it
   **Then** the list displays the empty state message

## Tasks / Subtasks

- [ ] Update `src/app/page.tsx` — add `handleDelete` and pass it down (AC: #1, #2)
  - [ ] Implement `handleDelete(id: string)` using immutable filter pattern
  - [ ] Pass `onDelete={handleDelete}` to `<TodoList>`
- [ ] Update `src/components/TodoList.tsx` — thread `onDelete` through to `TodoItem` (AC: #1, #2)
  - [ ] Add `onDelete: (id: string) => void` to `ITodoListProps`
  - [ ] Pass `onDelete` to each `<TodoItem>`
- [ ] Update `src/components/TodoItem.tsx` — add delete button (AC: #1)
  - [ ] Promote `onDelete` from optional to required in `ITodoItemProps`
  - [ ] Add a `<button>` that calls `onDelete(todo.id)` on click
- [ ] Update `src/components/TodoItem.module.css` — style the delete button (AC: #1)
  - [ ] Position button to the right of the todo title
- [ ] Update `src/__tests__/TodoItem.test.tsx` — add delete tests (AC: #1, #2)
  - [ ] Test: renders a delete button
  - [ ] Test: calls `onDelete` with the correct `id` when delete button is clicked
  - [ ] Test: does not call `onToggle` when delete button is clicked
- [ ] Update `src/__tests__/TodoList.test.tsx` — pass new required prop (AC: #1, #2)
  - [ ] Add `onDelete={vi.fn()}` to all existing `render(<TodoList ...>)` calls
  - [ ] Test: empty state is shown after the only todo is deleted (integration check via props)

## Dev Notes

### `src/app/page.tsx` — Add `handleDelete`

Add alongside `handleAdd` and `handleToggle`, then pass to `<TodoList>`:

```tsx
function handleDelete(id: string) {
  setTodos(prev => prev.filter(t => t.id !== id))
}

// In JSX:
<TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
```

**State update pattern:** `prev.filter(t => t.id !== id)`
- Returns a new array excluding the deleted todo
- All other todos pass through untouched
- Never `todos.splice()` — that mutates in place

### `src/components/TodoList.tsx` — Updated Props

```tsx
export interface ITodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void   // ← added
}

export function TodoList({ todos, onToggle, onDelete }: ITodoListProps) {
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
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
```

### `src/components/TodoItem.tsx` — Add Delete Button

```tsx
export interface ITodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void    // required now
  onEdit?: (id: string, newTitle: string) => void  // still optional — Story 2.4
}

export function TodoItem({ todo, onToggle, onDelete }: ITodoItemProps) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span className={styles.title}>{todo.title}</span>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className={styles.deleteButton}
        aria-label={`Delete "${todo.title}"`}
      >
        Delete
      </button>
    </li>
  )
}
```

**Key details:**
- `type="button"` is required — without it, a `<button>` inside a `<form>` defaults to `type="submit"`. Even though `TodoItem` is not currently inside a form, this is defensive practice and required by the architecture.
- `aria-label` on the button includes the todo title — essential for accessibility when multiple delete buttons exist on screen (screen readers would otherwise read "Delete Delete Delete...")
- No `"use client"` needed — no local hooks in this story

### `src/components/TodoItem.module.css` — Delete Button Styling

```css
.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.title {
  flex: 1;  /* pushes delete button to the far right */
}

.completed .title {
  text-decoration: line-through;
  opacity: 0.5;
}

.deleteButton {
  flex-shrink: 0;
  color: #c00;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.deleteButton:hover {
  color: #900;
}
```

**Layout note:** `flex: 1` on `.title` causes it to expand and fill available space, pushing `.deleteButton` to the trailing edge of the row. The checkbox and delete button use `flex-shrink: 0` to stay at their intrinsic sizes.

### Test Patterns — Updates to `src/__tests__/TodoItem.test.tsx`

Add these tests to the existing `TodoItem` describe block. All existing tests now need `onDelete={vi.fn()}` added:

```tsx
// Update ALL existing renders to include onDelete:
render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)

// New tests:
it('renders a delete button', () => {
  render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
  expect(screen.getByRole('button', { name: /delete "buy milk"/i })).toBeInTheDocument()
})

it('calls onDelete with the todo id when delete button is clicked', async () => {
  const user = userEvent.setup()
  const handleDelete = vi.fn()
  render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={handleDelete} />)
  await user.click(screen.getByRole('button', { name: /delete/i }))
  expect(handleDelete).toHaveBeenCalledOnce()
  expect(handleDelete).toHaveBeenCalledWith('1')
})

it('does not call onToggle when delete button is clicked', async () => {
  const user = userEvent.setup()
  const handleToggle = vi.fn()
  render(<TodoItem todo={incompleteTodo} onToggle={handleToggle} onDelete={vi.fn()} />)
  await user.click(screen.getByRole('button', { name: /delete/i }))
  expect(handleToggle).not.toHaveBeenCalled()
})
```

### Update `src/__tests__/TodoList.test.tsx`

All existing `render(<TodoList ...>)` calls need `onDelete={vi.fn()}` added:

```tsx
render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />)
render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />)
```

### Data Flow for This Story

```
page.tsx
  handleDelete(id) → setTodos(prev => prev.filter(t => t.id !== id))
      ↓ onDelete={handleDelete}
  TodoList
      ↓ onDelete={onDelete}
  TodoItem
      delete button onClick → onDelete(todo.id)
```

### Previous Story Context (Stories 2.1 and 2.2)

- `ITodoItemProps` already declares `onDelete?: (id: string) => void` — promote to required
- `TodoItem` already has the flex layout with `.title` — add `flex: 1` if not already present
- `page.tsx` already has `handleAdd` and `handleToggle` — add `handleDelete` alongside them
- `TodoList` already threads `onToggle` — add `onDelete` in the same pass
- All existing `TodoItem` tests already pass `onToggle` — add `onDelete` to each render call

### Architecture Guardrails — MUST Follow

| Rule | Requirement |
|---|---|
| State update | `prev.filter(t => t.id !== id)` — immutable, returns new array |
| Button type | `type="button"` — always explicit on non-submit buttons |
| Accessible label | `aria-label` on delete button must include the todo title |
| `onDelete` naming | Prop: `onDelete` / Handler: `handleDelete` — on/handle convention |
| No mutation | Never `todos.splice()`, never `delete todos[i]` |

### References

- Delete state update example: [Source: architecture.md#State Management Patterns]
- Component boundaries: [Source: architecture.md#Architectural Boundaries]
- Story requirements: [Source: epics.md#Story 2.3]

## Dev Agent Record

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent upon completion -->

### File List

<!-- To be filled by dev agent — list every file created or modified -->
