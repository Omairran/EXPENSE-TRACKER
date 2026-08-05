import { useState, useEffect } from 'react'
import TransactionCard from './TransactionCard'
import AddTransaction from './AddTransaction'

function TransactionList() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [categories, setCategories] = useState([])

  // Filter states
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const fetchTransactions = () => {
    fetch('http://localhost:8000/api/transactions/')
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        console.error("Error fetching transactions:", err)
        setError("Failed to load transactions.")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransactions()
    fetch('http://localhost:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err))
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

  const filteredTransactions = transactions.filter(txn => {
    // Type filter
    if (filterType !== 'all' && txn.type !== filterType) return false;
    
    // Category filter
    if (filterCategory !== 'all') {
      const txnCatId = txn.category ? txn.category.toString() : '';
      if (txnCatId !== filterCategory) return false;
    }
    
    // Date filter
    if (filterStartDate && new Date(txn.date) < new Date(filterStartDate)) return false;
    if (filterEndDate && new Date(txn.date) > new Date(filterEndDate)) return false;
    
    return true;
  });

  if (loading) return <p>Loading transactions...</p>
  if (error) return <p className="error-state" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>

  return (
    <div className="transaction-list-page">
      <div className="header-actions">
        
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Transaction</button>
      </div>

      <div className="filters-section" style={{ display: 'flex', gap: '10px', margin: '15px 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="filter-select" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="filter-select" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
          ))}
        </select>

        <input 
          type="date" 
          value={filterStartDate} 
          onChange={e => setFilterStartDate(e.target.value)}
          className="filter-date"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <span>to</span>
        <input 
          type="date" 
          value={filterEndDate} 
          onChange={e => setFilterEndDate(e.target.value)}
          className="filter-date"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <button 
          onClick={() => {
            setFilterType('all');
            setFilterCategory('all');
            setFilterStartDate('');
            setFilterEndDate('');
          }}
          style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#f0f0f0', cursor: 'pointer', fontWeight: '500' }}
        >
          Clear Filters
        </button>
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
        {filteredTransactions.length === 0 ? (
          <p className="empty-state">No transactions found matching your filters.</p>
        ) : (
          filteredTransactions.map(txn => (
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