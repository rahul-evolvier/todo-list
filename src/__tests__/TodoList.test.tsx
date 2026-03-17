import { render, screen } from '@testing-library/react'
import { TodoList } from '@/components/TodoList'
import { describe, it, expect, vi } from 'vitest'
import type { Todo } from '@/types/todo'

const mockTodos: Todo[] = [
  { id: '1', title: 'Buy milk', completed: false },
  { id: '2', title: 'Walk the dog', completed: true },
]

describe('TodoList', () => {
  it('renders empty state when no todos', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('renders a list item for each todo', () => {
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders each todo title', () => {
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })
})
