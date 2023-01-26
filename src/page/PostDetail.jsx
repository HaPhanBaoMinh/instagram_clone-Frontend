import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5'
import { RxBookmark, RxBookmarkFilled } from 'react-icons/rx';
import { TbMessageCircle2 } from 'react-icons/tb';
import { Swiper, SwiperSlide } from "swiper/react";
import instanceAxios from '../api/axios';
import ROUTER from '../api/router';
import PostDetailLoading from '../components/loading/PostDetailLoading';
import AuthContext from '../context/AuthProvider';
import { useCountTime } from '../hooks/useCountTime';
import { useParams } from 'react-router'
import dayjs from 'dayjs';
import { Navigation, Mousewheel, Keyboard, Pagination } from "swiper";
import Comment from '../components/newsFeed/Comment';
import SocketContext from '../context/SocketProvider';


function PostDetail() {
    const { Auth } = useContext(AuthContext);
    const comment = useRef();
    const [comments, setComments] = useState([]);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState();
    const [commentCount, setCommentCount] = useState();
    const [save, setSave] = useState(false);
    const { post_id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [images, seIimages] = useState([]);
    const [createAt, setCreateAt] = useState();
    const [caption, setCaption] = useState("");
    const [profile, setProfile] = useState();
    const socket = useContext(SocketContext);

    const getComments = async () => {
        const result = await instanceAxios.get(`/comment/${post_id}`);
        if (result.data.status) {
            setComments(result.data.result);
        }
    }

    const getPostById = async () => {
        try {
            if (!post_id) return;
            setIsLoading(true);
            const result = await instanceAxios.get(`/post/${post_id}`);
            if (result.data.status) {
                const post = result.data.result;
                setLikeCount(post.total_likes);
                setCommentCount(post.total_comments);
                seIimages(post.images);
                setIsLoading(false);
                setCreateAt(post.created_at);
                setCaption(post.caption);
                setProfile(post.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onComment = async () => {
        const data = {
            user_id: Auth._id,
            post_id: post_id,
            comment: comment.current.value,
            rep_comment_id: ""
        }
        if (!Auth || isLoading) return;
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

            socket.emit('comment_post', {
                post_id: post_id,
                user_id: Auth._id,
            })
            setComments(comment => [...comment, newComment]);
        }
    }

    const onClickLike = async () => {
        const data = {
            user_id: Auth._id,
            post_id: post_id,
        }
        if (!Auth || isLoading) return;

        if (!like) {
            const result = await instanceAxios.post("/like", data);
            if (result.data.status) {
                setLikeCount(count => count + 1);
            }
            socket.emit('like_post', {
                post_id: post_id,
                user_id: Auth._id,
            })
        } else {
            const result = await instanceAxios.post("/like/remove", data);
            if (result.data.status) {
                setLikeCount(count => count - 1);
            }
        }
        setLike(!like);
    }

    const onClickSave = () => {

    }

    const checkIsLiked = async () => {
        const data = {
            user_id: Auth._id,
            post_id: post_id,
        }
        const result = await instanceAxios.post("/like/check-like", data);
        if (result.data.status) {
            setLike(!result.data.isLikePost);
        }
    }

    useEffect(() => {
        getComments();
        getPostById();
    }, [])

    useEffect(() => {
        if (!Auth) return;
        checkIsLiked();
    }, [Auth])

    // useEffect(() => {

    // }, [socket])

    if (isLoading || !comments) {
        return <PostDetailLoading />
    }

    return (
        <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-full bg-[#fafafa]'>
            <div className='w-full h-full p-3 flex justify-center items-center' >
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
                                images.map(image =>
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
                            <div className='w-full py-3 h-fit px-3 bg-white gap-3 flex items-start '>
                                <div className={`w-[39px] h-[39px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={`${ROUTER}/image/${profile.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <div className='w-[85%] h-full '>
                                    <h4 className='font-normal text-sm leading-4 break-words'>
                                        {/* <span className='text-sm font-medium mr-2'> {profile.username} </span> */}
                                        {caption}
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
                            <p className='px-3 py-1 text-xs font-thin text-[#8e8e8e] cursor-pointer'> {dayjs(createAt).format('MMM D, YYYY')} </p>

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

export default PostDetail