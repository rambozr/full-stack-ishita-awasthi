import React from 'react'
import { Sun, Moon } from 'lucide-react'
import useTheme from '../../hooks/useTheme'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand-container">
            <span className="navbar-brand">
              Nimbus
            </span>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="theme-toggle"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar