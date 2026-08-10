import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from './Sidebar.module.css'

/**
 * Sidebar Component
 * Displays the main navigation links for the application.
 * Conditionally renders the Admin Panel link based on user permissions.
 */
function Sidebar() {
  const { user } = useContext(AuthContext)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.headingContainer}>
      
        <img
          src="/BJ_Logo-2.png"
          alt="Spentra Logo"
          className={styles.headingLogo}
        />     
      </div>
      <nav>
        <ul>
          <li><NavLink to="/" className={({isActive}) => isActive ? styles.active : ''}> Dashboard</NavLink></li>
          <li><NavLink to="/transactions" className={({isActive}) => isActive ? styles.active : ''}>Transactions</NavLink></li>
          <li><NavLink to="/budgets" className={({isActive}) => isActive ? styles.active : ''}> Budgets</NavLink></li>
          <li><NavLink to="/import" className={({isActive}) => isActive ? styles.active : ''}> Import Data</NavLink></li>
          <li><NavLink to="/reports" className={({isActive}) => isActive ? styles.active : ''}> Reports</NavLink></li>
          {(user?.is_superuser || user?.is_staff) && (
            <li><NavLink to="/admin-panel" className={({isActive}) => isActive ? styles.active : ''}> Admin Panel</NavLink></li>
          )}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar