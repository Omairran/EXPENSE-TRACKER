import { useState, useEffect } from 'react'
import TransactionCard from './TransactionCard'
import AddTransaction from './AddTransaction'

function TransactionList() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchTransactions = () => {
    fetch('http://localhost:8000/api/transactions/')
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching transactions:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/transactions/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactions(transactions.filter(txn => txn.id !== id));
      } else {
        alert("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  if (loading) return <p>Loading transactions...</p>

  return (
    <div className="transaction-list-page">
      <div className="header-actions">
        
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Transaction</button>
      </div>

      {showAddModal && (
        <AddTransaction 
          onCancel={() => setShowAddModal(false)}
          onAdd={(newTxn) => {
            setTransactions([newTxn, ...transactions])
            setShowAddModal(false)
          }}
        />
      )}
      
      <div className="transaction-list">
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions found. Add one to get started!</p>
        ) : (
          transactions.map(txn => (
            <TransactionCard 
              key={txn.id}
              description={txn.description}
              amount={txn.amount}
              category={txn.category_name || "Uncategorized"}
              date={txn.date}
              type={txn.type}
              onDelete={() => handleDelete(txn.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TransactionList