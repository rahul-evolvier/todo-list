import styles from './TodoCount.module.css'

export interface ITodoCountProps {
  total: number
  remaining: number
}

export function TodoCount({ total, remaining }: ITodoCountProps) {
  if (total === 0) return null

  return (
    <p className={styles.count}>
      <span className={styles.remaining}>{remaining}</span>
      {' '}{remaining === 1 ? 'item' : 'items'} left
    </p>
  )
}
