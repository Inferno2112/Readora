import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';
const EditPost = () => {
    const [posts, setposts] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setposts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
    return (
        <div className='py-8'>
            <Container>
                <PostForm post={posts} />
            </Container>
        </div>
    )
}

export default EditPost
