import React, {useState, useEffect, use} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

const AllPosts = () => {
    const [posts, setposts] = useState([]);
    useEffect(() => {
        appwriteService.getPosts([]).then(response => {
            if(response && response.documents){
                setposts(response.documents);
            }
        }).catch(error => {
            console.log(error);
        });
    }, []);

  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
            </Container>
    </div>
  )
}

export default AllPosts
