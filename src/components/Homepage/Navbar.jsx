import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GITHUB_URL = 'https://github.com'

const Navbar = () => {
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status)

    const handleStart = () => {
        if (authStatus) {
            navigate('/all-posts')
        } else {
            navigate('/login')
        }
    }

    return (
        <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:top-4 sm:w-[calc(100%-2rem)] md:top-6 md:w-[calc(100%-3rem)] max-w-4xl">
            <div
                className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full text-white min-h-[44px] sm:min-h-0"
                style={{
                    background: 'rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center shrink-0 min-w-0" aria-label="Readora home">
                    <span className="font-bold text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bebas tracking-tight truncate">
                        Readora
                    </span>
                </Link>

                {/* Right: Github + Start */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-white/60 text-white text-sm font-medium hover:bg-white/10 hover:border-white transition-colors touch-manipulation"
                        aria-label="GitHub"
                    >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span className="hidden sm:inline">Github</span>
                    </a>
                    <button
                        onClick={handleStart}
                        className="min-h-[44px] sm:min-h-0 px-3 py-2.5 sm:px-5 sm:py-2.5 rounded-full bg-orange-400 text-white text-xs sm:text-sm font-semibold hover:bg-orange-500 active:bg-orange-600 transition-colors whitespace-nowrap touch-manipulation"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
