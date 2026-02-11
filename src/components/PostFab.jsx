import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PostFab() {
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useSelector((state) => state.auth.status)
  const isHomePage = location.pathname === '/all-posts'

  if (!authStatus || !isHomePage) return null

  return (
    <button
      onClick={() => navigate('/add-post')}
      className="xl:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white hover:bg-zinc-200 text-black font-bold shadow-lg shadow-zinc-500/50 flex items-center justify-center transition-colors"
      aria-label="New post"
    >
      <span className="text-2xl leading-none">+</span>
    </button>
  )
}
