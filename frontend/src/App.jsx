import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import TransactionList from './components/TransactionList'
import ImportData from './components/ImportData'
import Budgets from './components/Budgets'
import Reports from './components/Reports'
import './App.css'

function Dashboard() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/transactions/summary/')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Error fetching summary:", err))
  }, [])

  return (
    <div className="dashboard-content">
      <h1>Overview</h1>
      {summary ? (
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

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/import" element={<ImportData />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App