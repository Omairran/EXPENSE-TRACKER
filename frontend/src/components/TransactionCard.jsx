function TransactionCard({ description, amount, category, date, type }) {
  return (
    <div className={`transaction-card ${type}`}>
      <div className="transaction-info">
        <p className="description">{description}</p>
        <p className="category">{category}</p>
      </div>
      <div className="transaction-meta">
        <p className="amount">
          {type === 'income' ? '+' : '-'}${Math.abs(amount)}
        </p>
        <p className="date">{date}</p>
      </div>
    </div>
  )
}

export default TransactionCard