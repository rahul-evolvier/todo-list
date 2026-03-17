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

  function handleToggle(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function handleDelete(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function handleEdit(id: string, newTitle: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t))
  }

  return (
    <main>
      <h1>Todo List</h1>
      <TodoInput onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
    </main>
  )
}
