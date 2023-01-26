import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Mousewheel, Keyboard, Pagination } from "swiper";
import demo from "../../images/308_4122.jpg";
import srcDemo from "../../images/313399065_1027735465289593_7195031916021187795_n.jpg";
import { BsThreeDots } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { TbMessageCircle2 } from 'react-icons/tb';
import { RxBookmark, RxBookmarkFilled } from 'react-icons/rx';
import ROUTER from '../../api/router';
import PostDetailLoading from '../loading/PostDetailLoading';
import AuthContext from '../../context/AuthProvider';
import instanceAxios from '../../api/axios';
import { useCountTime } from '../../hooks/useCountTime';
import Comment from './Comment';

function PopupFeed({ onClickSave, onClickLike, save, like = false, likeCount = 0, onClickClose, post, profile, updateCountComment }) {
    const { Auth } = useContext(AuthContext);
    const comment = useRef();
    const [comments, setComments] = useState([]);
    const [postTimeStep] = useCountTime(post.created_at);
    useEffect(() => {
        const getComments = async () => {
            const result = await instanceAxios.get(`/comment/${post._id}`);
            if (result.data.status) {
                setComments(result.data.result);
            }
        }
        getComments();
    }, [])

    const onComment = async () => {
        const data = {
            user_id: Auth._id,
            post_id: post._id,
            comment: comment.current.value,
            rep_comment_id: ""
        }
        if (!Auth || !post) return;
        const result = await instanceAxios.post(`/comment`, data);
        console.log(result);
        if (result.data.status) {
            comment.current.value = "";
            const newComment = {
                ...result.data.insert,
                user: {
                    avatar: Auth.avatar,
                    name: Auth.name,
                    username: Auth.username,
                    _id: Auth._id,
                }
            }

            setComments(comment => [...comment, newComment]);
        }
        updateCountComment();
    }

    if (!post || !comments) {
        return <PostDetailLoading />
    }

    return (
        <div className='xl:w-[100%] xl:pl-0 md:w-full md:pl-[75px] z-[60] top-0 right-0 w-full h-full  bg-[#59595968] fixed'>
            <div className='w-full h-full p-3 flex justify-center items-center' >
                <IoClose onClick={onClickClose} className='text-3xl right-3 top-3 absolute text-white hover:cursor-pointer' />
                {/* Image list */}
                <div className='container flex box-content animate-waving-hand overflow-hidden min-h-[590px] bg-white xl:w-[65%] lg:w-[90%] w-[90%] md:h-[85%] xl:h-[70%] rounded-xl h-[80%]'>
                    <div className='w-[100%] md:w-[40%] h-full bg-black'>
                        <Swiper
                            cssMode={true}
                            navigation={true}
                            pagination={true}
                            mousewheel={true}
                            keyboard={true}
                            modules={[Navigation, Mousewheel, Keyboard, Pagination]}
                            className="w-full h-full flex box-content items-center"
                            slidesPerView={1}
                        >
                            {
                                post.images.map(image =>
                                    <SwiperSlide key={image.id} className='w-full h-full cursor-pointer border-b flex flex-col justify-center items-center'>
                                        <img loading="lazy" src={`${ROUTER}/image/${image.filename}`} alt="" className='w-full h-full object-contain' />
                                    </SwiperSlide>
                                )
                            }
                        </Swiper>
                    </div>

                    <div className='w-[60%] h-full hidden md:block'>
                        {/* Header */}
                        <div className='w-full h-14 bg-white px-3 flex justify-between border-b'>
                            <div className='xl:w-[40%] w-[40%] h-full flex items-center'>
                                <div className={`w-[41px] h-[41px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={`${ROUTER}/image/${profile.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <a href="/" className='ml-2 text-sm font-medium hover:text-[#616161] transition-all'> {profile.username} </a>
                            </div>
                            <div className='flex items-center cursor-pointer'>
                                <BsThreeDots className='text-lg' />
                            </div>
                        </div>

                        <div className='w-full h-[396px] overflow-auto' >
                            {/* Caption */}
                            <div key={comment._id} className='w-full py-3 h-fit px-3 bg-white gap-3 flex items-start '>
                                <div className={`w-[39px] h-[39px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={`${ROUTER}/image/${profile.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <div className='w-[85%] h-full '>
                                    <h4 className='font-normal text-sm leading-4 break-words'>
                                        <span className='text-sm font-medium mr-2'> {profile.username} </span>
                                        {/* {comment.comment} */}
                                        {post.caption}
                                    </h4>

                                </div>
                            </div >

                            {/* Comment */}
                            {comments.length > 0 ?
                                comments.map(comment =>
                                    <Comment key={comment._id} comment={comment} />
                                )
                                :
                                <div className='w-full h-full flex flex-col justify-center items-center'>
                                    <h3 className='font-bold text-3xl'>Not comments yet.</h3>
                                    <p>Start the conversation</p>

                                </div>
                            }

                        </div>

                        <div className='w-full h-auto bg-white border-t'>
                            {/* React */}
                            <div className='w-full h-11 px-3'>
                                <div className='w-[22%] h-full items-center float-left gap-3 flex'>
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

                            {/* Likes */}
                            <h4 className='px-3 text-sm font-medium'>{likeCount} likes</h4>
                            <p className='px-3 py-1 text-xs font-thin text-[#8e8e8e] cursor-pointer'> {postTimeStep} </p>

                            {/* Comments */}
                            <div className='w-full px-3 h-[50px] pb-2 flex justify-between items-center'>
                                <FaRegSmile className='text-2xl cursor-pointer' />
                                <input ref={comment} type="text" className='w-[80%] bg-transparent outline-none border-none text-base' placeholder='Add a comment...' />
                                <h1 onClick={onComment} className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Post</h1>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupFeed