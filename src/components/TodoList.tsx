import { TodoItem } from '@/components/TodoItem'
import type { Todo } from '@/types/todo'
import styles from './TodoList.module.css'

export interface ITodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newTitle: string) => void
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: ITodoListProps) {
  if (todos.length === 0) {
    return <p className={styles.empty}>No todos yet. Add one above!</p>
  }

  return (
    <ul className={styles.list}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
