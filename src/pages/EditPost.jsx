import React, { useEffect, useState } from 'react'
import { PostForm, Sidebar, RightSidebar, PageHeader } from '../components'
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
                <PageHeader
                    onMenuOpen={() => setMobileMenuOpen(true)}
                    title="Edit Post"
                    centerReadora={false}
                    leftSlot={
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-zinc-900 transition-colors" aria-label="Back">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    }
                />

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
