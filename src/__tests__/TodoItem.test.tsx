import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '@/components/TodoItem'
import { describe, it, expect, vi } from 'vitest'
import type { Todo } from '@/types/todo'

const incompleteTodo: Todo = { id: '1', title: 'Buy milk', completed: false }
const completedTodo: Todo = { id: '2', title: 'Walk dog', completed: true }

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('renders a checkbox', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('checkbox is unchecked when todo is incomplete', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked when todo is completed', () => {
    render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={handleToggle} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('checkbox'))
    expect(handleToggle).toHaveBeenCalledOnce()
    expect(handleToggle).toHaveBeenCalledWith('1')
  })

  it('renders a delete button', () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /delete "buy milk"/i })).toBeInTheDocument()
  })

  it('calls onDelete with the todo id when delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={handleDelete} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(handleDelete).toHaveBeenCalledOnce()
    expect(handleDelete).toHaveBeenCalledWith('1')
  })

  it('does not call onToggle when delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<TodoItem todo={incompleteTodo} onToggle={handleToggle} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(handleToggle).not.toHaveBeenCalled()
  })
})

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
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /save/i }))
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
