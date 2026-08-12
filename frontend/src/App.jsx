import { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
  const [chartData, setChartData] = useState([])
  const [error, setError] = useState(null)
  const { authTokens, logoutUser, user } = useContext(AuthContext)

  useEffect(() => {
    if (!authTokens) return;

    Promise.all([
      fetch('http://localhost:8000/api/transactions/summary/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      }),
      fetch('http://localhost:8000/api/transactions/category_breakdown/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
    ])
      .then(async ([sumRes, catRes]) => {
        if(sumRes.status === 401){
          logoutUser()
          throw new Error('Unauthorized')
        }
        if(!sumRes.ok || !catRes.ok) throw new Error('Failed to fetch data')
        
        const sumData = await sumRes.json();
        const catData = await catRes.json();
        
        setSummary(sumData)
        setChartData(catData.map(item => ({ 
          name: item.category__name || 'Uncategorized', 
          total: parseFloat(item.total) 
        })))
      })
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
        <>
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
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>Expenses by Category</h3>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rs ${value}`} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="empty-state">No expense data available for chart.</p>
            )}
          </div>
        </>
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