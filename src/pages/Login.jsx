import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Mock authentication
    if (email === 'test@thesisgate.com' && password === '123456') {
      setTimeout(() => {
        setIsLoading(false)
        navigate('/payment')
      }, 1000)
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setError('Invalid credentials')
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="ThesisGate" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo" style={{display: 'none'}}>
              TG
            </div>
          </div>
          <h1 className="text-4xl gradient-text mb-3">
            Welcome to ThesisGate
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            AI-powered thesis proofreading made simple
          </p>
          <Link 
            to="/about" 
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Learn more about our technology →
          </Link>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-large w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <div className="demo-credentials">
          <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials</p>
          <div className="space-y-2">
            <code className="demo-credential">test@thesisgate.com</code>
            <code className="demo-credential">123456</code>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Use these credentials to test the application
          </p>
        </div>
      </div>
    </div>
  )
} 