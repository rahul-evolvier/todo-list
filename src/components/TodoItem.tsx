"use client"

import { useState } from 'react'
import type { Todo } from '@/types/todo'
import styles from './TodoItem.module.css'

export interface ITodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newTitle: string) => void
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
