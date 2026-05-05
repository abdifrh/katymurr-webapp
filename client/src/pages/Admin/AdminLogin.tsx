import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../utils/supabase'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        navigate('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Admin Login - Katy Murr</title>
      </Helmet>
      <div className="wp-admin-login">
        <div className="login-container">
        <div className="login-header">
          <h1>
            <a href="/" className="login-logo">Katy Murr</a>
          </h1>
          <p className="login-subtitle">Content Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="form-group remember-me">
            <label>
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="button button-primary button-large"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-to-site">← Back to Site</a>
        </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin

