import { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import TransactionList from './components/TransactionList'
import ImportData from './components/ImportData'
import Budgets from './components/Budgets'
import Reports from './components/Reports'
import Login from './components/Login'
import Register from './components/Register'
import AdminPanel from './components/AdminPanel'
import { AuthProvider } from './context/AuthContext'
import AuthContext from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'
import './App.css'

/**
 * Dashboard Component
 * Fetches and displays a summary of the user's finances, including total income, total expenses, and balance.
 */
function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)
  const { authTokens, logoutUser, user } = useContext(AuthContext)

  useEffect(() => {
    if (!authTokens) return;

    fetch('http://localhost:8000/api/transactions/summary/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
      .then(res => {
        if(res.status === 401){
          logoutUser()
          throw new Error('Unauthorized')
        }
        if(!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => setSummary(data))
      .catch(err => {
        if (err.message !== 'Unauthorized') {
          console.error("Error fetching summary:", err)
          setError("Failed to load dashboard summary.")
        }
      })
  }, [authTokens, logoutUser])

  return (
    <div className="dashboard-content">
      <div className="welcome-banner">
        <h2>Welcome, <span>{user?.username || 'User'}</span>!</h2>
        <p>Here's a quick overview of your finances.</p>
      </div>
      {/* Day 25: UX polish: loading states, friendly error messages */}
      {error && <p className="error-state" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {summary && !summary.detail ? (
        <div className="summary-cards">
          <div className="card">
            <h3>Total Income</h3>
            <p className="income">Rs {summary.total_income}</p>
          </div>
          <div className="card">
            <h3>Total Expenses</h3>
            <p className="expense">Rs {summary.total_expense}</p>
          </div>
          <div className="card">
            <h3>Balance</h3>
            <p className={summary.balance >= 0 ? "income" : "expense"}>Rs {summary.balance}</p>
          </div>
        </div>
      ) : (
        <p>Loading summary...</p>
      )}
    </div>
  )
}

/**
 * MainLayout Component
 * Defines the overall structural layout for authenticated routes, including the Sidebar, Navbar, and main content area.
 */
function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/import" element={<ImportData />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App