import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from './Budgets.module.css'

function AdminPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { authTokens, logoutUser, user } = useContext(AuthContext)

  useEffect(() => {
    if (!authTokens) return;

    fetch('http://localhost:8000/api/admin-dashboard/overview/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
      .then(res => {
        if(res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized');
        }
        if(!res.ok) throw new Error('Failed to fetch admin data');
        return res.json()
      })
      .then(resData => {
        setData(resData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching admin data:", err)
        setError(err.message === 'Unauthorized' ? "You do not have permission to view this page." : "Failed to load admin dashboard.")
        setLoading(false)
      })
  }, [authTokens])

  if (!user?.is_superuser && !user?.is_staff) {
    return <p className="error-state" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>You do not have admin permissions.</p>
  }

  if (loading) return <p>Loading Admin Dashboard...</p>
  if (error) return <p className="error-state" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>

  return (
    <div className="page-content">
      <h2>Admin Dashboard</h2>
      <div className="summary-cards" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.total_users}</p>
        </div>
        <div className="card" style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3>Total Transactions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.total_transactions}</p>
        </div>
        <div className="card" style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3>Total Expense Volume</h3>
          <p className="expense" style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>Rs {data.total_volume}</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3>User List</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Username</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Is Staff</th>
              <th style={{ padding: '10px' }}>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{u.id}</td>
                <td style={{ padding: '10px' }}>{u.username}</td>
                <td style={{ padding: '10px' }}>{u.email || 'N/A'}</td>
                <td style={{ padding: '10px' }}>{u.is_staff ? 'Yes' : 'No'}</td>
                <td style={{ padding: '10px' }}>{u.transaction_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPanel
