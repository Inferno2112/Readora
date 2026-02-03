import React from 'react'
import { Link } from 'react-router-dom'

const Logo = (width = "100px") => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
        <div className="w-4 h-6 bg-zinc-950 relative">
          <span className="absolute left-1 top-1 w-2 h-0.5 bg-yellow-400"></span>
          <span className="absolute left-1 top-2.5 w-2 h-0.5 bg-yellow-400"></span>
          <span className="absolute left-1 top-4 w-2 h-0.5 bg-yellow-400"></span>
        </div>
      </div>
      <span className="text-3xl font-bold text-yellow-400 tracking-tight">
        Readora
      </span>
    </div>
  )
}

export default Logo
