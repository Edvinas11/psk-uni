import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          University
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Courses
          </Link>
          <Link
            to="/courses/create"
            className={`navbar-link ${location.pathname === '/courses/create' ? 'active' : ''}`}
          >
            + New Course
          </Link>
          <Link
            to="/departments/stats"
            className={`navbar-link ${location.pathname === '/departments/stats' ? 'active' : ''}`}
          >
            Department Stats
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
