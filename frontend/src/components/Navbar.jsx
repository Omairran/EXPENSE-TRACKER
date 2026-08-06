import { useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from './Navbar.module.css'

function Navbar() {
  const location = useLocation()
  const { user, logoutUser } = useContext(AuthContext)
  
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
      
      <div className={styles.userInfo} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <span>Welcome, {user?.username || 'User'}</span>
        {user && (
          <button 
            onClick={logoutUser}
            style={{ 
              padding: '6px 16px', 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '9999px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar