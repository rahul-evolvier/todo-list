import { describe, it, expect } from 'vitest'
import type { Todo } from '@/types/todo'

describe('Todo type', () => {
  it('can create a valid todo object', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test todo',
      completed: false,
    }
    expect(todo.id).toBe('1')
    expect(todo.title).toBe('Test todo')
    expect(todo.completed).toBe(false)
  })
})
