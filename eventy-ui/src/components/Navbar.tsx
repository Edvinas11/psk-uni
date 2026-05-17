import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Eventy
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Events
          </Link>
          <Link
            to="/events/create"
            className={`navbar-link ${location.pathname === '/events/create' ? 'active' : ''}`}
          >
            + New Event
          </Link>
          <Link
            to="/categories/stats"
            className={`navbar-link ${location.pathname === '/categories/stats' ? 'active' : ''}`}
          >
            Category Stats
          </Link>
          <Link
            to="/demo"
            className={`navbar-link ${location.pathname === '/demo' ? 'active' : ''}`}
          >
            CDI Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}
