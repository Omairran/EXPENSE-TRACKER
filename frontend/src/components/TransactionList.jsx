import TransactionCard from './TransactionCard'

function TransactionList({ transactions }) {
  return (
    <div className="transactions">
      {transactions.map((tx) => (
        <TransactionCard
          key={tx.id}
          description={tx.description}
          amount={tx.amount}
          category={tx.category}
          date={tx.date}
          type={tx.type}
        />
      ))}
    </div>
  )
}

export default TransactionList