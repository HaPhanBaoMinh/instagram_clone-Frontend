import React, { useContext, useEffect, useState } from 'react'
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import instanceAxios from '../../api/axiosConfig';
import ROUTER from '../../api/router';
import AuthContext from '../../context/AuthProvider';
import SocketContext from '../../context/SocketProvider';
import srcObject from "../../images/308_4122.jpg"
import PostItemLoading from '../loading/PostItemLoading';
import PopupFeed from '../newsFeed/PopupFeed';

function PostItem({ postInfo, profile }) {
    const [popUpPost, setPopUpPost] = useState(false);
    const [post, setPost] = useState(null);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(postInfo.total_likes);
    const [commentCount, setCommentCount] = useState(postInfo.total_comments);
    const { Auth } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (postInfo) {
            setPost(postInfo);
        }

        if (!Auth || !post) return;

        const checkIsLiked = async () => {
            const data = {
                user_id: Auth._id,
                post_id: post._id,
            }
            const result = await instanceAxios.post("/like/check-like", data);
            if (result.data.status) {
                setLike(!result.data.isLikePost);
            }
        }

        checkIsLiked();

    }, []);


    // Open or Close popupPOst
    const onClickPost = () => {
        setPopUpPost(!popUpPost);
    }

    const onClickLike = async () => {
        const data = {
            user_id: Auth._id,
            post_id: post._id,
        }
        if (!Auth || !post) return;

        if (!like) {
            const result = await instanceAxios.post("/like", data);
            if (result.data.status) {
                setPost(post => (
                    {
                        ...post,
                        total_likes: post.total_likes + 1
                    }
                ))
                socket.emit('like_post', {
                    post_id: post._id,
                    user_id: Auth._id,
                })
                setLikeCount(count => count + 1);
            }
        } else {
            if (likeCount === 0) return;
            const result = await instanceAxios.post("/like/remove", data);
            if (result.data.status) {
                setLikeCount(count => count - 1);
                setPost(post => (
                    {
                        ...post,
                        total_likes: post.total_likes - 1
                    }
                ))
            }
        }

        setLike(!like);
    }

    const updateCountComment = () => {
        setCommentCount(count => count + 1);
    }


    if (!post || !profile) {
        return <PostItemLoading />
    }

    return (
        <>
            <div onClick={onClickPost} className="w-1/3 px-1 md:px-3 cursor-pointer group overflow-hidden">
                <img loading="lazy" src={`${ROUTER}/image/${post.images[0].filename}`} alt="" className='aspect-square object-cover relative' />
                <div className='w-full h-full justify-center bg-[#0000005f] relative top-[-100%] opacity-0 group-hover:opacity-100 flex'>
                    <div className='w-[30%] flex justify-center gap-5'>
                        <div className='flex justify-center relative items-center gap-2'>
                            <AiFillHeart className='text-sm md:text-xl text-white relative' />
                            <h3 className='text-sm md:text-xl font-medium text-white'> {likeCount} </h3>
                        </div>

                        <div className='flex justify-center items-center gap-2'>
                            <AiFillMessage className='text-sm md:text-xl text-white' />
                            <h3 className='text-sm md:text-xl font-medium text-white'>{commentCount}</h3>
                        </div>
                    </div>
                </div>
            </div>
            {popUpPost && post ? <PopupFeed onClickClose={onClickPost} likeCount={likeCount} updateCountComment={updateCountComment} commentCount={commentCount} like={like} onClickLike={onClickLike} post={post} profile={profile} /> : undefined}
        </>
    )
}

export default PostItem

