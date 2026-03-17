import { render, screen } from '@testing-library/react'
import { TodoCount } from '@/components/TodoCount'
import { describe, it, expect } from 'vitest'

describe('TodoCount', () => {
  it('renders nothing when there are no todos', () => {
    const { container } = render(<TodoCount total={0} remaining={0} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows correct count with singular "item"', () => {
    render(<TodoCount total={3} remaining={1} />)
    expect(screen.getByText((_, el) => el?.tagName === 'P' && el?.textContent === '1 item left')).toBeInTheDocument()
  })

  it('shows correct count with plural "items"', () => {
    render(<TodoCount total={3} remaining={2} />)
    expect(screen.getByText((_, el) => el?.tagName === 'P' && el?.textContent === '2 items left')).toBeInTheDocument()
  })

  it('shows 0 items left when all are completed', () => {
    render(<TodoCount total={3} remaining={0} />)
    expect(screen.getByText((_, el) => el?.tagName === 'P' && el?.textContent === '0 items left')).toBeInTheDocument()
  })
})
