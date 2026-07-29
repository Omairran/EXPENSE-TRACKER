import styles from './Navbar.module.css'

function Navbar({ userName }) {
  return (
    <header className={styles.navbar}>
      <h3>Dashboard</h3>
      <span>Welcome, {userName}</span>
    </header>
  )
}

export default Navbar