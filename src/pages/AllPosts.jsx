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

    <div class="relative h-full w-full bg-black"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div><div class="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
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
    
    </div>
  )
}

export default AllPosts
