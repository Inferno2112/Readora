import React, { useEffect, useState } from 'react'
import { PostForm, Sidebar, RightSidebar } from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditPost = () => {
    const [posts, setposts] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setposts(post)
                }
                setLoading(false);
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    if (!authStatus) {
        return null
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-black">
                <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                <div className="flex-1 flex items-center justify-center border-x border-zinc-800 lg:ml-[400px] xl:mr-[400px]">
                    <div className="w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                </div>
                <RightSidebar />
            </div>
        )
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
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-zinc-900 transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-white">Edit Post</h1>
                    </div>
                </div>

                {/* Post Form */}
                <div className="p-4">
                    <PostForm post={posts} />
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}

export default EditPost
