import { useState, useEffect } from 'react'
import styles from './Budgets.module.css'

function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/budgets/progress/')
      .then(res => res.json())
      .then(data => {
        setBudgets(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching budgets:", err)
        setError("Failed to load budgets.")
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading budgets...</p>
  if (error) return <p className="error-state" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>

  return (
    <div className="page-content">
           
      <div className={styles.budgetGrid}>
        {budgets.length === 0 ? (
          <p className="empty-state">No budgets found.</p>
        ) : (
          budgets.map(budget => (
            <div key={budget.id} className={styles.budgetCard}>
              <div className={styles.budgetHeader}>
                <h3>{budget.category_name}</h3>
                <span className={budget.percentage >= 100 ? styles.overBudget : ''}>
                  Rs {budget.spent} / Rs {budget.limit}
                </span>
              </div>
              
              <div className={styles.progressBarBg}>
                <div 
                  className={`${styles.progressBarFill} ${budget.percentage >= 100 ? styles.danger : (budget.percentage > 80 ? styles.warning : styles.safe)}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className={styles.budgetFooter}>
                <p>{budget.percentage.toFixed(1)}% used</p>
                <p>Rs {Math.max(budget.remaining, 0).toFixed(2)} remaining</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Budgets
