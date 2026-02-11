import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Logo } from './index'

function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      name: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.5L2.5 12H5v9h6v-6h2v6h6v-9h2.5L12 2.5z" />
        </svg>
      ),
      path: '/all-posts',
      active: location.pathname === '/all-posts',
    },
    {
      name: 'Explore',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      path: '/explore',
      active: location.pathname === '/explore',
    },
    {
      name: 'Notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      path: '/notifications',
      active: location.pathname === '/notifications',
    },
    {
      name: 'Bookmarks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      path: '/bookmarks',
      active: location.pathname === '/bookmarks',
    },
    {
      name: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: userData?.$id ? `/profile/${userData.$id}` : '/login',
      active: location.pathname.startsWith('/profile'),
    },
  ]

  if (!authStatus) {
    return null
  }

  const handleNavClick = (path) => {
    navigate(path)
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  const sidebarContent = (
    <div className="flex flex-col max-h-400 w-full bg-black  rounded-xl  p-4">
        {/* Logo */}
        <div className="py-4 mb-4">
          <Link to="/all-posts">
            <Logo className="w-8" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors
                ${item.active 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="text-xl">{item.name}</span>
            </button>
          ))}
        </nav>

        
      </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col items-start px-4 xl:px-6 h-screen fixed left-0 top-0 z-40 border-r border-zinc-800/50 w-[400px] bg-black/40 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Mobile Sidebar */}
          <aside 
            className="fixed left-0 top-0 h-full w-[280px] bg-black/90 backdrop-blur-xl border-r border-zinc-800/50 overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Close Button */}
              <div className="flex items-center justify-between mb-4">
                {/* <Link to="/all-posts" onClick={() => setMobileMenuOpen(false)}>
                  <Logo className="w-8" />
                </Link> */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
