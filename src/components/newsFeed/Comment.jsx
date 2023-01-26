import React, { useContext, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import instanceAxios from '../../api/axios';
import ROUTER from '../../api/router'
import AuthContext from '../../context/AuthProvider';
import { useCountTime } from '../../hooks/useCountTime';

function Comment({ comment }) {
    const [commentStepTime] = useCountTime(comment.created_at);
    const [like, setLike] = useState(false);
    const { Auth } = useContext(AuthContext);
    const [likeCount, setlikeCount] = useState();

    useEffect(() => {
        const checkIsLiked = async () => {
            const data = {
                user_id: Auth._id,
                post_id: comment._id,
            }
            const result = await instanceAxios.post("/like/check-like", data);
            if (result.data.status) {
                setLike(!result.data.isLikePost);
            }
        }
        if (comment) {
            setlikeCount(comment.total_likes);
        }
        checkIsLiked();
    }, [])

    const onClickLikeComment = async () => {
        if (!Auth || !comment) return;

        const data = {
            user_id: Auth._id,
            post_id: comment._id,
        }

        if (!like) {
            const result = await instanceAxios.post("/like", data);
            if (result.data.status) {
                setLike(!like);
                setlikeCount(count => count + 1);
            }
        } else {
            const result = await instanceAxios.post("/like/remove", data);
            if (result.data.status) {
                setLike(!like);
                setlikeCount(count => count - 1);
            }
        }
    }

    return (
        <>
            <div key={comment._id} className='w-full py-3 h-fit px-3 bg-white gap-3 flex items-start justify-between'>
                <div className={`w-[39px] h-[39px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    <img loading="lazy" src={`${ROUTER}/image/${comment.user.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                </div>
                <div className='w-[85%] h-full '>
                    <h4 className='font-normal text-sm leading-3	'>
                        <span className='text-sm font-medium mr-2'> {comment.user.username} </span>
                        {comment.comment}
                    </h4>
                    <h4 className='w-[100%] flex mt-1 items-end gap-3'>
                        <span className='text-sm font-light text-[#8e8e8e]'>{commentStepTime}</span>
                        <span className='text-xs text-[#8e8e8e] font-medium cursor-pointer'>{likeCount} likes</span>
                    </h4>

                </div>
                {
                    like ?
                        <AiFillHeart onClick={onClickLikeComment} className='cursor-pointer text-red-600' />
                        :
                        <AiOutlineHeart onClick={onClickLikeComment} className='cursor-pointer' />
                }
            </div >

        </>
    )
}
export default Comment