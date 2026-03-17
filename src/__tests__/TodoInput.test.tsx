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
