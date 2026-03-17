# Story 2.4: Edit Todo Title Inline

Status: ready-for-dev

## Story

As a user,
I want to edit an existing todo's title inline,
so that I can correct or update my task descriptions.

## Acceptance Criteria

1. **Given** a todo exists in the list
   **When** the user clicks the Edit button (or double-clicks the title)
   **Then** the todo title is replaced by an editable input field pre-filled with the current title

2. **Given** the user is in edit mode
   **When** the user changes the text and confirms (Save button or Enter key)
   **Then** the todo title is updated with the trimmed new text
   **And** the todo returns to display mode

3. **Given** the user is in edit mode
   **When** the user cancels (Escape key or Cancel button)
   **Then** the title reverts to the original value unchanged
   **And** the todo returns to display mode

4. **Given** the user is in edit mode
   **When** the input is empty or whitespace only
   **Then** saving is prevented (Save button disabled, Enter key does nothing)

## Tasks / Subtasks

- [ ] Update `src/app/page.tsx` — add `handleEdit` and pass it down (AC: #2)
  - [ ] Implement `handleEdit(id: string, newTitle: string)` using immutable map pattern
  - [ ] Pass `onEdit={handleEdit}` to `<TodoList>`
- [ ] Update `src/components/TodoList.tsx` — thread `onEdit` through to `TodoItem` (AC: #2)
  - [ ] Add `onEdit: (id: string, newTitle: string) => void` to `ITodoListProps`
  - [ ] Pass `onEdit` to each `<TodoItem>`
- [ ] Update `src/components/TodoItem.tsx` — full inline edit implementation (AC: #1–#4)
  - [ ] Add `"use client"` directive — this component now uses `useState`
  - [ ] Add local state: `isEditing: boolean`, `draftText: string`
  - [ ] Promote `onEdit` from optional to required in `ITodoItemProps`
  - [ ] Display mode: show title + Edit button + Delete button + checkbox
  - [ ] Edit mode: show text input (pre-filled) + Save button + Cancel button; hide checkbox, title, Edit button, Delete button
  - [ ] Edit button click: enter edit mode, pre-fill draft with `todo.title`
  - [ ] Double-click on title span: also enters edit mode
  - [ ] Save: call `onEdit(todo.id, draftText.trim())`, exit edit mode — only if `draftText.trim() !== ''`
  - [ ] Cancel: revert `draftText` to `todo.title`, exit edit mode
  - [ ] Enter key in edit input: triggers save (if valid)
  - [ ] Escape key in edit input: triggers cancel
  - [ ] Save button: disabled when `draftText.trim() === ''`
  - [ ] Auto-focus the edit input when entering edit mode
- [ ] Update `src/components/TodoItem.module.css` — edit mode styles (AC: #1)
  - [ ] Edit input takes the full width of the title area
  - [ ] Style Save and Cancel buttons distinctly
- [ ] Write tests in `src/__tests__/TodoItem.test.tsx` — add edit mode tests (AC: #1–#4)
  - [ ] Test: Edit button is visible in display mode
  - [ ] Test: clicking Edit button shows an input field pre-filled with the todo title
  - [ ] Test: clicking Edit button hides the title span
  - [ ] Test: save button is disabled when edit input is cleared
  - [ ] Test: save button is disabled when edit input is whitespace only
  - [ ] Test: calls `onEdit` with trimmed value when Save button is clicked
  - [ ] Test: exits edit mode and shows updated title after save
  - [ ] Test: pressing Enter saves the edit
  - [ ] Test: pressing Escape cancels and reverts to original title
  - [ ] Test: Cancel button reverts to original title without calling `onEdit`
- [ ] Update `src/__tests__/TodoList.test.tsx` — pass new required prop
  - [ ] Add `onEdit={vi.fn()}` to all existing `render(<TodoList ...>)` calls

## Dev Notes

### `src/app/page.tsx` — Add `handleEdit`

Add alongside `handleAdd`, `handleToggle`, `handleDelete`:

```tsx
function handleEdit(id: string, newTitle: string) {
  setTodos(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t))
}

// In JSX:
<TodoList
  todos={todos}
  onToggle={handleToggle}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>
```

**State update pattern:** `prev.map(t => t.id === id ? { ...t, title: newTitle } : t)`
- Spread `{ ...t }` first, override only `title`
- Never `t.title = newTitle` — direct mutation

### `src/components/TodoList.tsx` — Updated Props

```tsx
export interface ITodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newTitle: string) => void  // ← added
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: ITodoListProps) {
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
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
```

### `src/components/TodoItem.tsx` — Full Implementation

This component now has local state — `"use client"` is required.

```tsx
"use client"

import { useState } from 'react'
import type { Todo } from '@/types/todo'
import styles from './TodoItem.module.css'

export interface ITodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newTitle: string) => void  // required now
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: ITodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState('')

  function handleEditStart() {
    setDraftText(todo.title)
    setIsEditing(true)
  }

  function handleSave() {
    if (draftText.trim() === '') return
    onEdit(todo.id, draftText.trim())
    setIsEditing(false)
  }

  function handleCancel() {
    setDraftText(todo.title)
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (isEditing) {
    return (
      <li className={styles.item}>
        <input
          type="text"
          value={draftText}
          onChange={e => setDraftText(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.editInput}
          autoFocus
          aria-label="Edit todo title"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={draftText.trim() === ''}
          className={styles.saveButton}
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </li>
    )
  }

  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span
        className={styles.title}
        onDoubleClick={handleEditStart}
      >
        {todo.title}
      </span>
      <button
        type="button"
        onClick={handleEditStart}
        className={styles.editButton}
        aria-label={`Edit "${todo.title}"`}
      >
        Edit
      </button>
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

**Critical design decisions:**

**Two JSX branches** (`isEditing ? ... : ...`) — a single `if` return for edit mode and a separate return for display mode. This is cleaner than toggling visibility with CSS and avoids accidental checkbox render during edit.

**`autoFocus` on edit input** — moves focus immediately to the edit field when entering edit mode. This is a standard accessibility pattern and prevents the user needing to click twice.

**`handleKeyDown` on edit input only** — Escape/Enter only fire when the edit input is focused. Do not attach key handlers to the `<li>` or document.

**`draftText` initialized in `handleEditStart`** — not in `useState('')` initialization. This ensures the input is always pre-filled with the latest `todo.title` even if the title was updated between renders.

**`handleCancel` resets `draftText`** — even though it won't be shown, resetting keeps state clean for the next edit session.

**`onDoubleClick` on title span** — provided as a convenience in addition to the Edit button. The Edit button is the primary interaction for accessibility; double-click is a discoverable shortcut.

### `src/components/TodoItem.module.css` — Edit Mode Styles

```css
.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.title {
  flex: 1;
  cursor: default;
}

.title:hover {
  /* subtle hint that double-click is available */
  text-decoration: underline dotted;
}

.completed .title {
  text-decoration: line-through;
  opacity: 0.5;
}

.editInput {
  flex: 1;
  min-width: 0;
  padding: 0.25rem 0.5rem;
}

.editButton,
.deleteButton,
.saveButton,
.cancelButton {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.deleteButton {
  color: #c00;
}
.deleteButton:hover { color: #900; }

.saveButton {
  color: #060;
}
.saveButton:hover:not(:disabled) { color: #030; }
.saveButton:disabled { opacity: 0.4; cursor: not-allowed; }

.cancelButton {
  color: #666;
}
.cancelButton:hover { color: #333; }
```

### Test Patterns — Updates to `src/__tests__/TodoItem.test.tsx`

Update all existing renders to include `onEdit`:

```tsx
render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
```

Add these new tests:

```tsx
describe('TodoItem — edit mode', () => {
  it('renders an Edit button in display mode', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /edit "buy milk"/i })).toBeInTheDocument()
  })

  it('shows pre-filled input when Edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('textbox', { name: /edit todo title/i })).toHaveValue('Buy milk')
  })

  it('hides the title span when in edit mode', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
  })

  it('disables Save when edit input is cleared', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByRole('textbox'))
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('disables Save when edit input is whitespace only', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), '   ')
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('calls onEdit with trimmed value when Save is clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={handleEdit} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), '  Updated title  ')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(handleEdit).toHaveBeenCalledWith('1', 'Updated title')
  })

  it('exits edit mode and shows title after save', async () => {
    const user = userEvent.setup()
    // Parent controls actual title — simulate by passing updated todo after save
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /save/i }))
    // Back to display mode — edit input gone, title visible
    expect(screen.queryByRole('textbox', { name: /edit todo title/i })).not.toBeInTheDocument()
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('saves on Enter key press', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={handleEdit} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'New title{Enter}')
    expect(handleEdit).toHaveBeenCalledWith('1', 'New title')
  })

  it('cancels on Escape key press and reverts title', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={handleEdit} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'Changed{Escape}')
    expect(handleEdit).not.toHaveBeenCalled()
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('Cancel button reverts to original title without calling onEdit', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={handleEdit} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'Changed')
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleEdit).not.toHaveBeenCalled()
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })
})
```

### Data Flow for This Story

```
page.tsx
  handleEdit(id, newTitle) → setTodos(prev => prev.map(...update title...))
      ↓ onEdit={handleEdit}
  TodoList
      ↓ onEdit={onEdit}
  TodoItem  (local: isEditing, draftText)
      Edit button → handleEditStart() → setIsEditing(true), setDraftText(todo.title)
      Save / Enter → handleSave() → onEdit(id, draftText.trim()), setIsEditing(false)
      Cancel / Escape → handleCancel() → setDraftText(todo.title), setIsEditing(false)
```

### Previous Story Context (Stories 2.1–2.3)

- `ITodoItemProps` already declares `onEdit?: (id: string, newTitle: string) => void` — promote to required
- `TodoItem` has no `"use client"` yet — **add it** — this is the first story where `TodoItem` uses `useState`
- `page.tsx` already has `handleAdd`, `handleToggle`, `handleDelete` — add `handleEdit` alongside
- `TodoList` already threads `onToggle` and `onDelete` — add `onEdit` in the same pass
- All existing `TodoItem` tests pass `onToggle` and `onDelete` — add `onEdit={vi.fn()}` to each render call

### Architecture Guardrails — MUST Follow

| Rule | Requirement |
|---|---|
| `"use client"` | Required on `TodoItem` — it now uses `useState` |
| State update | `prev.map(t => t.id === id ? { ...t, title: newTitle } : t)` — immutable |
| `draftText` init | Set in `handleEditStart`, not in `useState('')` default |
| Key handlers | `onKeyDown` on the `<input>` only — not on `<li>` or document |
| Save guard | Check `draftText.trim() === ''` in both `handleSave` and `disabled` prop |
| Cancel | Resets `draftText` to `todo.title` — does not call `onEdit` |
| `autoFocus` | On edit `<input>` — required for accessibility |
| `type="button"` | On all buttons — explicit to prevent accidental form submit |
| `onEdit` naming | Prop: `onEdit` / Handler: `handleEdit` / Initiator: `handleEditStart` |

### References

- Edit state update example: [Source: architecture.md#State Management Patterns]
- State boundaries (TodoItem owns edit state): [Source: architecture.md#State Boundaries]
- Component boundaries: [Source: architecture.md#Architectural Boundaries]
- Story requirements: [Source: epics.md#Story 2.4]

## Dev Agent Record

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent upon completion -->

### File List

<!-- To be filled by dev agent — list every file created or modified -->
