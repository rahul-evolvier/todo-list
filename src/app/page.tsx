"use client"

import { useState, useEffect } from 'react'
import { TodoInput } from '@/components/TodoInput'
import { TodoList } from '@/components/TodoList'
import type { Todo } from '@/types/todo'

const STORAGE_KEY = 'todos'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setTodos(JSON.parse(stored))
    } catch {
      // ignore corrupted data
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

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
