import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import appwriteService from '../appwrite/config'

export default function PageHeader({ onMenuOpen, title, centerReadora = true, leftSlot }) {
  const userData = useSelector((state) => state.auth.userData)

  return (
    <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: custom leftSlot or avatar (mobile) opens menu - no hamburger */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          {leftSlot ?? (
          <button
            onClick={onMenuOpen}
            className="lg:hidden p-1 rounded-full hover:bg-zinc-900 transition-colors touch-manipulation"
            aria-label="Open menu"
          >
            {userData?.prefs?.avatarId ? (
              <img
                src={appwriteService.getFilePreview(userData.prefs.avatarId)}
                alt={userData.name || 'Menu'}
                className="w-9 h-9 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {(userData?.name || userData?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </button>
          )}
        </div>

        {/* Center: Readora (Home) or page title */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          {centerReadora ? (
            <Link to="/all-posts" className="text-lg sm:text-xl font-bold text-white tracking-tight hover:opacity-90">
              Readora
            </Link>
          ) : (
            <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
          )}
        </div>

        {/* Right: avatar when leftSlot is used (so menu still works), else spacer */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          {leftSlot ? (
            <button
              onClick={onMenuOpen}
              className="lg:hidden p-1 rounded-full hover:bg-zinc-900 transition-colors touch-manipulation"
              aria-label="Open menu"
            >
              {userData?.prefs?.avatarId ? (
                <img src={appwriteService.getFilePreview(userData.prefs.avatarId)} alt="" className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {(userData?.name || userData?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
