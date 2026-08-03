import { useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar({ userName = "Umair Ahmad" }) {
  const location = useLocation()
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard'
      case '/transactions': return 'Transactions'
      case '/budgets': return 'Budgets'
      case '/import': return 'Import Data'
      case '/reports': return 'Reports'
      default: return 'Expense Tracker'
    }
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.logoContainer}>
        <h3>{getPageTitle()}</h3>
      </div>
      
      <div className={styles.userInfo}>
        <span>Welcome, {userName}</span>
      </div>
    </header>
  )
}

export default Navbar