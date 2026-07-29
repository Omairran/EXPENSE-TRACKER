import styles from './Sidebar.module.css'

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.headingContainer}>
        <img
          src="/favicon.png"
          alt="Expense Tracker Logo"
          className={styles.headingLogo}
        />

        <h2>Expense Tracker</h2>
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