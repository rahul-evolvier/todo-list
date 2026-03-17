"use client"

import { useState } from 'react'
import styles from './TodoInput.module.css'

export interface ITodoInputProps {
  onAdd: (title: string) => void
}

export function TodoInput({ onAdd }: ITodoInputProps) {
  const [inputText, setInputText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inputText.trim() === '') return
    onAdd(inputText.trim())
    setInputText('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder="Add a new todo..."
        className={styles.input}
      />
      <button
        type="submit"
        disabled={inputText.trim() === ''}
        className={styles.button}
      >
        Add
      </button>
    </form>
  )
}
