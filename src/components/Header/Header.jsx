import React, { useState, useRef, useEffect } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import appwriteService from '../../appwrite/config'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const navItems = [
    { name: 'Home', slug: "/", active: false },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Home", slug: "/all-posts", active: authStatus },
    { name: "My Posts", slug: "/my-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ]

  const handleNavClick = (slug) => {
    navigate(slug)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const homeLink = authStatus ? "/all-posts" : "/"

  return (
    <header className="sticky top-0 z-50 bg-zinc-900/70 backdrop-blur-xl border-b border-white/10">
      <Container>
        <nav className="flex items-center justify-between py-3 sm:py-4">
          {/* Left: spacer for balance (same width as right so logo stays centered) */}
          <div className="w-10 h-10 flex items-center justify-center md:w-12">
            {authStatus && (
              <div className="md:hidden w-10 h-10" aria-hidden />
            )}
          </div>

          {/* Center: Readora (Home) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link to={homeLink} onClick={() => setMobileMenuOpen(false)} className="flex items-center">
              <Logo width="80px" className="w-16 sm:w-20 md:w-24" />
            </Link>
          </div>

          {/* Right: Desktop nav items OR Mobile avatar */}
          <div className="relative flex items-center gap-2" ref={menuRef}>
            <ul className="hidden md:flex items-center gap-2 lg:gap-3">
              {navItems.map((item) =>
                item.active ? (
                  <li key={`${item.name}-${item.slug}`}>
                    <Button
                      onClick={() => handleNavClick(item.slug)}
                      variant="outline"
                      className="px-4 lg:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-zinc-300 border-zinc-700 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200"
                    >
                      {item.name}
                    </Button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li className="ml-2">
                  <LogoutBtn />
                </li>
              )}
            </ul>

            {/* Mobile: avatar instead of hamburger (when logged in), or login/signup */}
            <div className="md:hidden flex items-center">
              {authStatus ? (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1 rounded-full ring-2 ring-transparent hover:ring-zinc-600 transition-all"
                  aria-label="Open menu"
                >
                  {userData?.prefs?.avatarId ? (
                    <img
                      src={appwriteService.getFilePreview(userData.prefs.avatarId)}
                      alt={userData.name || 'Avatar'}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {(userData?.name || userData?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => handleNavClick('/login')} variant="outline" size="sm" className="text-zinc-300 border-zinc-700">
                    Login
                  </Button>
                  <Button onClick={() => handleNavClick('/signup')} size="sm" className="bg-white text-black hover:bg-zinc-200">
                    Signup
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile dropdown: below avatar */}
            {mobileMenuOpen && authStatus && (
              <div className="md:hidden absolute right-0 top-full mt-1 py-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50">
                <ul className="flex flex-col gap-0.5">
                  {navItems.filter((i) => i.active).map((item) => (
                    <li key={`${item.name}-${item.slug}`}>
                      <button
                        onClick={() => handleNavClick(item.slug)}
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                  <li className="border-t border-zinc-800 mt-1 pt-1">
                    <div className="px-4 py-2">
                      <LogoutBtn />
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
