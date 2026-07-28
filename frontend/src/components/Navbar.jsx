function Navbar({ userName }) {
  return (
    <header className="navbar">
      <h3>Dashboard</h3>
      <span>Welcome, {userName}</span>
    </header>
  )
}

export default Navbar