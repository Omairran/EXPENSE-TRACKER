import TransactionCard from './TransactionCard'

function TransactionList({ transactions, onDelete }) {
  return (
    <div className="transactions">
      {transactions.map((tx) => (
        <TransactionCard
          key={tx.id}
          {...tx}
          onDelete={() => onDelete(tx.id)}
        />
      ))}
    </div>
  )
}

export default TransactionList