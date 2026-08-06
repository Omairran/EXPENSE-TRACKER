import { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Register() {
  const { registerUser, user } = useContext(AuthContext)

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        <form onSubmit={registerUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input type="text" name="username" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input type="email" name="email" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input type="password" name="password" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ padding: '12px', background: '#00C49F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
