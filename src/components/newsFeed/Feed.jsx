import React, { useContext, useEffect, useRef, useState } from 'react';
import srcDemo from "../../images/313399065_1027735465289593_7195031916021187795_n.jpg";
import { BsBookmark, BsThreeDots } from "react-icons/bs";
import StoryItem from '../storyBox/StoryItem';
import { Swiper, SwiperSlide } from "swiper/react";
import { AiOutlineHeart, AiFillHeart, AiOutlineShareAlt } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import { RxBookmark, RxBookmarkFilled } from "react-icons/rx"
import { BsEmojiSmile } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Mousewheel, Keyboard, Pagination } from "swiper";
import demo from "../../images/313399065_1027735465289593_7195031916021187795_n.jpg"
import PopupFeed from './PopupFeed';
import ROUTER from '../../api/router';
import { useCountTime } from '../../hooks/useCountTime';
import AuthContext from '../../context/AuthProvider';
import instanceAxios from '../../api/axios';
import { v4 as uuidv4 } from 'uuid';
import SocketContext from '../../context/SocketProvider';
import { Link } from 'react-router-dom';

function Feed({ feed }) {
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(feed.total_likes);
    const [commentCount, setCommentCount] = useState(feed.total_comments);
    const [save, setSave] = useState(false);
    const [more, setMore] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [caption, setCaption] = useState(feed.caption);
    const [postTimeStep] = useCountTime(feed.created_at);
    const { Auth } = useContext(AuthContext);
    const comment = useRef();
    const socket = useContext(SocketContext);

    const onClickLike = async () => {
        const data = {
            user_id: Auth._id,
            post_id: feed._id,
        }
        if (!Auth || !feed) return;

        if (!like) {
            const result = await instanceAxios.post("/like", data);
            if (result.data.status) {
                setLikeCount(count => count + 1);
            }
            socket.emit('like_post', {
                post_id: feed._id,
                user_id: Auth._id,
            })
        } else {
            await instanceAxios.post("/like/remove", data);
            setLikeCount(count => count - 1);
        }
        setLike(!like);
    }

    const onIncreaseCommentNumber = () => {
        setCommentCount(count => count + 1);
    }

    const onClickSave = () => {
        setSave(!save);
    }

    const onClickMore = () => {
        setMore(!more);
    }

    const onClickViewAllComment = () => {
        setViewAll(!viewAll);
    }

    const checkIsLiked = async () => {
        const data = {
            user_id: Auth._id,
            post_id: feed._id,
        }
        const result = await instanceAxios.post("/like/check-like", data);
        if (result.data.status) {
            setLike(!result.data.isLikePost);
        }
    }

    const onComment = async () => {
        const data = {
            user_id: Auth._id,
            post_id: feed._id,
            comment: comment.current.value,
            rep_comment_id: ""
        }
        if (!Auth || !feed) return;
        const result = await instanceAxios.post(`/comment`, data);
        console.log(result);
        if (result.data.status) {
            comment.current.value = "";
        }

        socket.emit('comment_post', {
            post_id: feed._id,
            user_id: Auth._id,
        })
        setCommentCount(count => count + 1);
    }

    useEffect(() => {
        if (caption.length < 10) {
            setMore(true);
        }
        checkIsLiked();
    }, [])


    return (
        <>
            <div className='w-full mb-3 box-content overflow-hidden rounded-lg border'>
                {/* Header */}
                <div className='w-full h-14 bg-white px-3 flex justify-between border-b'>
                    <div className='w-[30%] h-full flex gap-1 items-center'>
                        <div className={`w-[41px] h-[41px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            <img loading="lazy" src={`${ROUTER}/image/${feed.user.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                        </div>
                        <Link to={`/user/${feed.user.username}`} className='text-sm font-medium hover:text-[#616161] transition-all'> {feed.user.username} </Link>
                    </div>
                    <div className='flex items-center cursor-pointer'>
                        <BsThreeDots className='text-lg' />
                    </div>
                </div>
                {/* Images */}
                <div className='w-full h-[587px] bg-black flex justify-center'>
                    <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={true}
                        mousewheel={true}
                        keyboard={true}
                        modules={[Navigation, Mousewheel, Keyboard, Pagination]}
                        className="w-full h-full flex items-center"
                        slidesPerView={1}
                    >
                        {
                            feed.images.map(img =>
                                <SwiperSlide key={uuidv4()} className='w-full h-full cursor-pointer border-b flex flex-col justify-center items-center'>
                                    <img loading="lazy" src={`${ROUTER}/image/${img.filename}`} alt="" className='w-full h-full object-contain' />
                                </SwiperSlide>)
                        }
                    </Swiper>
                </div>

                {/* Reaction */}
                <div className='w-full h-11 px-3'>
                    <div className='w-[22%] h-full items-center float-left justify-between flex'>
                        {
                            like ?
                                <AiFillHeart onClick={onClickLike} className='text-red-500 cursor-pointer transition-all text-2xl' />
                                : <AiOutlineHeart onClick={onClickLike} className='cursor-pointer hover:text-[#8e8e8e] transition-all text-2xl' />
                        }
                        <TbMessageCircle2 className='cursor-pointer hover:text-[#8e8e8e] transition-all text-2xl' />
                        <AiOutlineShareAlt className='cursor-pointer  hover:text-[#8e8e8e] transition-all text-2xl' />
                    </div>
                    <div className='h-full items-center float-right flex'>
                        {
                            save ?
                                <RxBookmarkFilled onClick={onClickSave} className='cursor-pointer transition-all text-2xl' />
                                : <RxBookmark onClick={onClickSave} className='cursor-pointer hover:text-[#8e8e8e] transition-all text-2xl' />
                        }
                    </div>
                </div>

                {/* Like */}
                <h4 className='px-3 text-sm font-medium'>{likeCount} likes</h4>
                <p className={more ? "px-3 text-sm text-clip overflow-hidden break-words" : "px-3 text-sm text-clip overflow-hidden h-auto"}>
                    <span className='text-sm font-medium'>{feed.user.username} </span>
                    {more ? undefined : caption.substring(0, 10)}
                    {more ? undefined : <><span onClick={onClickMore} className='text-sm font-normal cursor-pointer text-[#8e8e8e]' > ...more</span> <br /></>}
                    {more ? caption : undefined}
                </p>

                <p onClick={onClickViewAllComment} className='px-3 pt-2 text-sm text-[#8e8e8e] cursor-pointer'>View all {commentCount} comments</p>
                <p className='px-3 py-1 text-[11px] font-light text-[#8e8e8e] cursor-pointer'> {postTimeStep} </p>

                <div className='w-full px-3 h-[50px] flex justify-between items-center'>
                    <FaRegSmile className='text-2xl cursor-pointer' />
                    <input type="text" ref={comment} className='w-[80%] outline-none bg-transparent border-none text-base' placeholder='Add a comment...' />
                    <h1 onClick={onComment} className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Post</h1>
                </div>

            </div>
            {viewAll ? <PopupFeed onClickLike={onClickLike} likeCount={likeCount} onClickClose={onClickViewAllComment} onIncreaseCommentNumber={onIncreaseCommentNumber} profile={feed.user} post={feed} onClickSave={onClickSave} like={like} save={save} /> : undefined}
        </>
    )

}

export default Feed