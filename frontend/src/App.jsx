import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import TransactionList from './components/TransactionList'
import transactions from './data/transactions.json'
import './App.css'

function App() {
  return (
    <div className="appLayout">
      <Sidebar />
      <div className="mainContent">
        <Navbar userName="Umair Ahmad" />
        <div className="transactionsArea">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
export default App