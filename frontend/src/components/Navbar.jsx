import styles from './Navbar.module.css'

function Navbar({ userName }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.logoContainer}>
        <h3>Dashboard</h3>
      </div>
      
      <div className={styles.userInfo}>
        <span>Welcome, {userName}</span>
      </div>
    </header>
  )
}

export default Navbar