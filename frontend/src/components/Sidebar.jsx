import styles from './Sidebar.module.css'

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.headingContainer}>
      
        <img
          src="/Logo.png"
          alt="Spentra Logo"
          className={styles.headingLogo}
        />     
      </div>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Transactions</li>
          <li>Budgets</li>
          <li>Reports</li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar