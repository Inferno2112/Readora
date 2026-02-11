import React, { useState } from 'react'
import { PostForm, Sidebar, RightSidebar } from '../components'
import { useSelector } from 'react-redux'

const AddPost = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const authStatus = useSelector((state) => state.auth.status)

  if (!authStatus) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 lg:w-[630px] lg:ml-[400px] xl:mr-[400px] border-x border-zinc-800 min-h-screen overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Create Post</h1>
          </div>
        </div>

        {/* Post Form */}
        <div className="p-4">
          <PostForm />
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}

export default AddPost
