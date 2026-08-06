import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from './AddTransaction.module.css'

function AddTransaction({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: ''
  })
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {
    fetch('http://localhost:8000/api/categories/', {
      headers: {
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
      .then(res => {
        if(res.status === 401) logoutUser();
        return res.json()
      })
      .then(data => setCategories(data))
      .catch(err => console.error(err))
  }, [authTokens, logoutUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
          ...formData,
          category: formData.category || null,
        }),
      })

      if (response.ok) {
        const newTxn = await response.json()
        onAdd(newTxn)
      } else {
        alert("Error adding transaction")
      }
    } catch (error) {
      console.error(error)
      alert("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Add New Transaction</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Amount</label>
            <input 
              type="number" 
              step="0.01" 
              required 
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Date</label>
            <input 
              type="date" 
              required 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <input 
              type="text" 
              required 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category (Optional)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Adding...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransaction
