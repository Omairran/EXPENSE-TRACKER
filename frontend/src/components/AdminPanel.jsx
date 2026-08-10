import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [overviewData, setOverviewData] = useState(null)
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { authTokens, user } = useContext(AuthContext)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + String(authTokens?.access)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ovRes, usRes, catRes, budRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin-dashboard/overview/', { headers }),
        fetch('http://localhost:8000/api/admin-users/', { headers }),
        fetch('http://localhost:8000/api/admin-categories/', { headers }),
        fetch('http://localhost:8000/api/admin-budgets/', { headers })
      ])
      
      if (!ovRes.ok || !usRes.ok || !catRes.ok || !budRes.ok) {
        throw new Error('Failed to fetch admin data (unauthorized or network error)')
      }
      
      setOverviewData(await ovRes.json())
      setUsers(await usRes.json())
      setCategories(await catRes.json())
      setBudgets(await budRes.json())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authTokens) fetchData()
  }, [authTokens])

  const handleDelete = async (endpoint, id, stateSetter, stateArray) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/${endpoint}/${id}/`, { method: 'DELETE', headers })
      if (res.ok) stateSetter(stateArray.filter(item => item.id !== id))
      else alert('Failed to delete')
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value
    try {
      const res = await fetch('http://localhost:8000/api/admin-users/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, email, password })
      })
      if (res.ok) {
        const newUser = await res.json()
        setUsers([...users, newUser])
        e.target.reset()
      } else alert('Failed to add user')
    } catch (err) { console.error(err) }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const color = e.target.color.value
    try {
      const res = await fetch('http://localhost:8000/api/admin-categories/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, color })
      })
      if (res.ok) {
        setCategories([...categories, await res.json()])
        e.target.reset()
      } else alert('Failed to add category')
    } catch (err) { console.error(err) }
  }

  if (!user?.is_superuser && !user?.is_staff) return <p className="error-state" style={{ color: 'red', textAlign: 'center' }}>You do not have admin permissions.</p>
  if (loading) return <p>Loading Admin Dashboard...</p>
  if (error) return <p className="error-state" style={{ color: 'red', textAlign: 'center' }}>{error}</p>

  const tabStyle = (tab) => ({
    padding: '10px 20px', cursor: 'pointer', border: 'none', background: activeTab === tab ? '#007bff' : '#eee', color: activeTab === tab ? 'white' : 'black', borderRadius: '4px', marginRight: '10px'
  })

  return (
    <div className="page-content">
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users</button>
        <button style={tabStyle('categories')} onClick={() => setActiveTab('categories')}>Categories</button>
        <button style={tabStyle('budgets')} onClick={() => setActiveTab('budgets')}>Budgets</button>
      </div>

      {activeTab === 'overview' && overviewData && (
        <div className="summary-cards" style={{ display: 'flex', gap: '20px' }}>
          <div className="card" style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3>Total Users</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{overviewData.total_users}</p>
          </div>
          <div className="card" style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3>Total Transactions</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{overviewData.total_transactions}</p>
          </div>
          <div className="card" style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3>Expense Volume</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>Rs {overviewData.total_volume}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
          <h3>Manage Users</h3>
          <form onSubmit={handleAddUser} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input name="username" placeholder="Username" required style={{ padding: '8px' }}/>
            <input name="email" placeholder="Email" type="email" required style={{ padding: '8px' }}/>
            <input name="password" placeholder="Password" type="password" required style={{ padding: '8px' }}/>
            <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Add User</button>
          </form>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Username</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Is Staff</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{u.id}</td>
                  <td style={{ padding: '10px' }}>{u.username}</td>
                  <td style={{ padding: '10px' }}>{u.email || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{u.is_staff ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleDelete('admin-users', u.id, setUsers, users)} style={{ padding: '4px 8px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
          <h3>Manage Categories</h3>
          <form onSubmit={handleAddCategory} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input name="name" placeholder="Category Name" required style={{ padding: '8px' }}/>
            <input name="color" type="color" defaultValue="#ff0000" style={{ padding: '4px' }}/>
            <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Add Category</button>
          </form>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Color</th>
                <th style={{ padding: '10px' }}>User ID</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{c.id}</td>
                  <td style={{ padding: '10px' }}>{c.name}</td>
                  <td style={{ padding: '10px' }}><div style={{ width: '20px', height: '20px', background: c.color, borderRadius: '50%' }}></div></td>
                  <td style={{ padding: '10px' }}>{c.user || 'Global'}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleDelete('admin-categories', c.id, setCategories, categories)} style={{ padding: '4px 8px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
          <h3>Manage Budgets</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Category Name</th>
                <th style={{ padding: '10px' }}>Limit</th>
                <th style={{ padding: '10px' }}>User ID</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{b.id}</td>
                  <td style={{ padding: '10px' }}>{b.category_name || b.category}</td>
                  <td style={{ padding: '10px' }}>Rs {b.limit}</td>
                  <td style={{ padding: '10px' }}>{b.user}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleDelete('admin-budgets', b.id, setBudgets, budgets)} style={{ padding: '4px 8px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
