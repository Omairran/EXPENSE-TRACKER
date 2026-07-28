import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import TransactionList from './components/TransactionList'
import transactions from './data/transactions.json'

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar userName="Umair Ahmad" />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}
export default App