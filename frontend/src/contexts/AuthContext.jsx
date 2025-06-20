
import { createContext, useContext, useState, useEffect } from "react"
import api, { setAuthToken } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // You could also fetch user data here if needed
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { token: newToken, userId } = response.data

      

      setToken(newToken)
      localStorage.setItem("token", newToken)
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
      
      // Fetch user data
      const userResponse = await api.get(`/users/${userId}`)
      setUser(userResponse.data)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      await api.post("/auth/register", userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
