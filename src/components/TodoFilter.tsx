import styles from './TodoFilter.module.css'

export type FilterType = 'all' | 'active' | 'completed'

export interface ITodoFilterProps {
  current: FilterType
  onChange: (filter: FilterType) => void
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export function TodoFilter({ current, onChange }: ITodoFilterProps) {
  return (
    <div className={styles.container}>
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`${styles.button} ${current === value ? styles.active : ''}`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
