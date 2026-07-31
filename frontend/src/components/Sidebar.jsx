import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

function Sidebar() {
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
                
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar