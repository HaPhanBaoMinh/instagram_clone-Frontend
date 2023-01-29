import React, { useState } from 'react'
import { useEffect } from 'react'
import instanceAxios from '../api/axiosConfig';
import PostItem from '../components/post/PostItem';

const Trending = () => {
    const [postList, setPostList] = useState();
    const getTrendingPost = async () => {
        try {
            const result = await instanceAxios.get("/post/trending");
            if (result.data.status) {
                setPostList(result.data.result)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getTrendingPost();
        document.title = "Trending • Instagram";
    }, [])

    if (!postList) {
        return <div>Loading...</div>
    }

    console.log(postList);

    return (
        <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-auto bg-[#fafafafa]'>
            <div className='flex w-[100%] flex-wrap py-3'>
                {
                    postList.map(post => <PostItem key={post._id} postInfo={post} profile={post.user} />)
                }
            </div>
        </div>
    )
}

export default Trending