import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoFilter } from '@/components/TodoFilter'
import { describe, it, expect, vi } from 'vitest'
import type { FilterType } from '@/components/TodoFilter'

describe('TodoFilter', () => {
  it('renders All, Active, and Completed buttons', () => {
    render(<TodoFilter current="all" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument()
  })

  it('marks the current filter button as pressed', () => {
    render(<TodoFilter current="active" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /active/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with correct filter when button is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<TodoFilter current="all" onChange={handleChange} />)
    await user.click(screen.getByRole('button', { name: /completed/i }))
    expect(handleChange).toHaveBeenCalledWith('completed' as FilterType)
  })

  it('calls onChange with "active" when Active is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<TodoFilter current="all" onChange={handleChange} />)
    await user.click(screen.getByRole('button', { name: /active/i }))
    expect(handleChange).toHaveBeenCalledWith('active' as FilterType)
  })

  it('calls onChange with "all" when All is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<TodoFilter current="completed" onChange={handleChange} />)
    await user.click(screen.getByRole('button', { name: /all/i }))
    expect(handleChange).toHaveBeenCalledWith('all' as FilterType)
  })
})
