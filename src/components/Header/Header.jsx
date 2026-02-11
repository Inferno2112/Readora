import React, { useState } from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"


function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: false
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "Home",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "My Posts",
      slug: "/My-posts",
      active: authStatus, 
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]

  const handleNavClick = (slug) => {
    navigate(slug)
    setMobileMenuOpen(false)
  }

  return (
  <header className="sticky top-0 z-50 bg-zinc-900/70 backdrop-blur-xl border-b border-white/10">
    <Container>
      <nav className="flex items-center justify-between py-3 sm:py-4">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <Logo width="80px" className="w-16 sm:w-20 md:w-24" />
          </Link>
        </div>

        {/* Desktop Nav Items */}
        <ul className="hidden md:flex items-center gap-2 lg:gap-3">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <Button
                  onClick={() => handleNavClick(item.slug)}
                  variant="outline"
                  className="
                    px-4 lg:px-5 py-2 rounded-full text-xs sm:text-sm font-medium
                    text-zinc-300 border-zinc-700
                    hover:text-white hover:bg-blue-500 hover:border-blue-500
                    transition-all duration-200
                  "
                >
                  {item.name}
                </Button>
              </li>
            ) : null
          )}

          {/* Logout */}
          {authStatus && (
            <li className="ml-2">
              <LogoutBtn />
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 py-4 animate-in slide-in-from-top-2">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <Button
                    onClick={() => handleNavClick(item.slug)}
                    variant="outline"
                    className="
                      w-full justify-start px-4 py-2 rounded-lg text-sm font-medium
                      text-zinc-300 border-zinc-700
                      hover:text-white hover:bg-blue-500 hover:border-blue-500
                      transition-all duration-200
                    "
                  >
                    {item.name}
                  </Button>
                </li>
              ) : null
            )}

            {/* Logout */}
            {authStatus && (
              <li className="mt-2">
                <div className="px-4">
                  <LogoutBtn />
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </Container>
  </header>
);
}

export default Header
