import styles from './TransactionCard.module.css'

function TransactionCard({ description, amount, category, date, type }) {
  return (
    <div className={`${styles.card} ${styles[type] || ''}`}>
      <div className="transaction-info">
        <p className={styles.description}>{description}</p>
        <p className={styles.category}>{category}</p>
      </div>
      <div className="transaction-meta">
        <p className={styles.amount}>
          {type === 'income' ? '+' : '-'}${Math.abs(amount)}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  )
}

export default TransactionCard