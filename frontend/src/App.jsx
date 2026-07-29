import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import TransactionList from './components/TransactionList'
import initialTransactions from './data/transactions.json'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState(initialTransactions)

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id))
  }

  return (
    <div className="appLayout">
      <Sidebar />
      <div className="mainContent">
        <Navbar userName="Umair Ahmad" />
        <div className="transactionsArea">
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  )
}
export default App