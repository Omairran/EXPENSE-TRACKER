import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  )
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
  )
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const loginUser = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
      navigate('/')
    } else {
      alert('Invalid username or password!')
    }
  }

  const registerUser = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
        email: e.target.email.value
      })
    })

    if (response.ok) {
      alert("Registration successful, please login.")
      navigate('/login')
    } else {
      alert('Error registering user. Username might be taken.')
    }
  }

  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
    navigate('/login')
  }

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [authTokens, loading])

  const contextData = {
    user,
    authTokens,
    loginUser,
    registerUser,
    logoutUser,
  }

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
