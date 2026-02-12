import React, { useState } from 'react'
import { PostForm, Sidebar, RightSidebar, PageHeader } from '../components'
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
        <PageHeader onMenuOpen={() => setMobileMenuOpen(true)} title="Create Post" centerReadora={false} />

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
