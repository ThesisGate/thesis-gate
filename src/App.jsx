import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Payment from './pages/Payment'
import Upload from './pages/Upload'
import About from './pages/About'
import Signup from './pages/Signup'
import './index.css'

// Navigation Header Component
function NavigationHeader() {
  const location = useLocation()
  
  // Don't show navigation on login page to keep it clean
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className="container max-w-6xl py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4 nav-link">
          <div className="logo-container" style={{ width: '3rem', height: '3rem', margin: 0 }}>
            <img 
              src="/logo.png" 
              alt="ThesisGate" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo" style={{ 
              display: 'none', 
              width: '3rem', 
              height: '3rem', 
              fontSize: '1rem',
              margin: 0 
            }}>
              TG
            </div>
          </div>
          <span className="text-xl font-bold gradient-text">ThesisGate</span>
        </Link>
        
        <div className="flex space-x-2">
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/upload" 
            className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
          >
            Upload
          </Link>
          <Link 
            to="/payment" 
            className={`nav-link ${location.pathname === '/payment' ? 'active' : ''}`}
          >
            Plans
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <NavigationHeader />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
