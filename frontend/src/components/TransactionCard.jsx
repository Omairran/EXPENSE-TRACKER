import styles from './TransactionCard.module.css'

function TransactionCard({ description, amount, category, date, type, onDelete }) {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div>
        <p className={styles.description}>{description}</p>
        <p className={styles.category}>{category}</p>
      </div>
      <div>
        <p className={styles.amount}>
          {type === 'income' ? '+' : '-'}Rs {Math.abs(amount)}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
      <button onClick={onDelete} className={styles.deleteBtn}>✕</button>
    </div>
  )
}

export default TransactionCard