import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ width = "100px", className = "" }) => {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
        <div className="w-3 h-4 sm:w-4 sm:h-6 bg-zinc-950 relative">
          <span className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 w-1.5 sm:w-2 h-0.5 bg-yellow-400"></span>
          <span className="absolute left-0.5 top-1.5 sm:left-1 sm:top-2.5 w-1.5 sm:w-2 h-0.5 bg-yellow-400"></span>
          <span className="absolute left-0.5 top-2.5 sm:left-1 sm:top-4 w-1.5 sm:w-2 h-0.5 bg-yellow-400"></span>
        </div>
      </div>
      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400 tracking-tight">
        Readora
      </span>
    </div>
  )
}

export default Logo
