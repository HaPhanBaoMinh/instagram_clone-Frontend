import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AiOutlineSetting, AiOutlineTag } from 'react-icons/ai'
import { BsGrid3X3 } from 'react-icons/bs'
import { HiOutlinePlus } from 'react-icons/hi'
import { MdSlowMotionVideo } from 'react-icons/md'
import { useParams } from 'react-router'
import instanceAxios from '../api/axios'
import ROUTER from '../api/router'
import ProfileLoading from '../components/loading/ProfileLoading'
import PostItem from '../components/post/PostItem'
import srcLogo from "../images/images.jfif"
import AuthContext from '../context/AuthProvider';
import PopupUpdateAvatar from '../components/profile/PopupUpdateAvatar'
import { Link } from 'react-router-dom'
import FollowListPopup from '../components/followList/FollowListPopup'

function Profile() {
    const [selected, setSelected] = useState('posts');
    const { username } = useParams();
    const [profile, setProfile] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { Auth, setAuth } = useContext(AuthContext);
    const [isSeftProfile, setIsSeftProfile] = useState(false);
    const [isNewFollow, setIsNewFollow] = useState(false);
    // const [confirmUnFollow, setConfirmUnFollow] = useState(false);
    const [onUpdateAvatar, setOnUpdateAvatar] = useState(false);
    const [followSelectPopup, setFollowSelectPopup] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        const getProfile = async () => {
            setIsLoading(true);
            const result = await instanceAxios.get(`/user/${username}`);
            console.log(result);
            if (result.data.status) {
                setProfile(result.data.result);
                setFollowerCount(result.data.result.followers);
                setIsLoading(false);
            };
        }
        getProfile();
    }, [document.URL]);

    const updateAvatar = (newAvatar) => {
        // setProfile(auth => (
        //     {
        //         ...auth,
        //         avatar: newAvatar
        //     }
        // ))
        setAuth(auth => (
            {
                ...auth,
                avatar: newAvatar
            }
        ))
    }

    useEffect(() => {
        const checkIsFollow = async () => {
            const data = {
                user_id: Auth._id,
                follower_id: profile._id
            }
            const result = await instanceAxios.post(`/user/check-follow`, data);
            if (result.data.isNewFollow) {
                setIsNewFollow(true);
                return;
            }
            setIsNewFollow(false);
        }

        if (Auth && profile) {
            checkIsFollow();
            document.title = `${profile.username} • Instagram`
            if (Auth.username === profile.username) {
                setIsSeftProfile(true);
                return
            }

            setIsSeftProfile(false);
        }
    }, [Auth, profile])

    const onSelectUpdateAvatar = () => {
        setOnUpdateAvatar(!onUpdateAvatar);
    }

    const onSelectFollowPopup = (select) => {
        setFollowSelectPopup(select);
    }


    const onClickFollow = async () => {
        const data = {
            user_id: Auth._id,
            follower_id: profile._id
        }
        try {
            const result = await instanceAxios.post("/user/follow", data);
            if (result.data.status) {
                setIsNewFollow(false);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    const onUnFollow = async () => {
        const data = {
            user_id: Auth._id,
            follower_id: profile._id
        }
        try {

            const result = await instanceAxios.post("/user/unfollow", data);
            if (result.data.status) {
                setIsNewFollow(true);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const onSelectPosts = () => {
        setSelected('posts')
    }

    const onSelectSave = () => {
        setSelected('save')
    }

    const onSelectTagged = () => {
        setSelected('tagged')
    }


    if (isLoading || !profile) {
        return <ProfileLoading />
    }


    return (
        <>
            <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-full bg-[#fafafafa]'>
                <div className='max-w-[975px] h-full m-auto'>
                    <div className='md:w-full h-1/2 md:px-11 md:pb-[30px] box-content px-4 w-auto'>
                        {/* User info */}
                        <div className='h-1/2 w-full pt-6 gap-2 flex'>
                            {/* Logo */}
                            <div className='w-[30%] h-full flex items-center' onClick={onSelectUpdateAvatar}>
                                <div className={`md:w-[150px] md:h-[150px] w-[100px] h-[100px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={`${ROUTER}/image/${profile.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                            </div>
                            <div className='w-[70%] h-full'>
                                <div className='w-full h-[30%] items-center flex gap-5'>
                                    <h4 className='text-lg flex items-center'>{profile.username}</h4>
                                    {
                                        isSeftProfile
                                            ?
                                            <Link to={"/account/edit"}>
                                                <button className='animation-waving-hand font-normal cursor-pointer transition-all hover:bg-[#d6d6d6] px-3 py-2 bg-[#efefef] h-[80%] rounded-md '>Edit profile</button>
                                            </Link>
                                            :
                                            <>

                                                {
                                                    isNewFollow ?
                                                        <button onClick={onClickFollow} className='animation-waving-hand font-medium cursor-pointer transition-all hover:bg-blue-500 text-sm bg-blue-400 text-white px-3 h-[70%] rounded-md'>Follow</button>
                                                        :
                                                        <button onClick={onUnFollow} className='flex justify-center items-center gap-1 font-medium cursor-pointer transition-all hover:bg-[#d6d6d6] text-sm bg-[#efefef] text-black px-3 h-[70%] rounded-md'>
                                                            Following
                                                        </button>
                                                }
                                                <button className='font-medium cursor-pointer transition-all hover:bg-[#d6d6d6] text-sm bg-[#efefef] text-black px-3 h-[70%] rounded-md'>Message</button>
                                            </>
                                    }
                                    <AiOutlineSetting className='text-2xl cursor-pointer md:block hidden' />
                                </div>
                                <div className='w-full gap-2 md:gap-4 flex mt-4'>
                                    <span>
                                        <span className='font-medium'> {profile.posts} </span>
                                        posts
                                    </span>
                                    <span onClick={() => onSelectFollowPopup("Followers")} className="cursor-pointer">
                                        <span className='font-medium'> {followerCount} </span>
                                        followers
                                    </span>
                                    <span onClick={() => onSelectFollowPopup("Following")} className="cursor-pointer">
                                        <span className='font-medium'> {profile.following} </span>
                                        following
                                    </span>
                                </div>

                                <div className='mt-2'>
                                    <h4 className='font-medium'>{profile.name}</h4>
                                    <p className='w-full text-left font-light text-sm whitespace-pre-line'> {profile.bio} </p>
                                </div>
                            </div>
                        </div>

                        {/* Story */}
                        <div className='h-1/2 w-full pt-6 flex items-center gap-10 overflow-auto'>
                            <div className='w-fit justify-center items-center flex flex-col'>
                                <div className={`w-[77px] h-[77px] border-[#c7c7c7] border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <HiOutlinePlus className='text-[#c7c7c7] text-3xl' />
                                </div>
                                <p className='text-sm font-medium text-[#c7c7c7]'>New</p>
                            </div>

                            <div className='w-fit justify-center items-center flex flex-col'>
                                <div className={`w-[77px] h-[77px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={srcLogo} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <p className='text-sm font-medium'>Demo</p>
                            </div>

                            <div className='w-fit justify-center items-center flex flex-col'>
                                <div className={`w-[77px] h-[77px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={srcLogo} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <p className='text-sm font-medium'>Demo</p>
                            </div>

                            <div className='w-fit justify-center items-center flex flex-col'>
                                <div className={`w-[77px] h-[77px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                    <img loading="lazy" src={srcLogo} alt="" className='w-full h-full object-cover rounded-full' />
                                </div>
                                <p className='text-sm font-medium'>Demo</p>
                            </div>

                        </div>
                    </div>

                    <div className='w-full h-1/2 border-t-2'>
                        <div className='w-full flex justify-center gap-2 mb-3'>
                            {
                                selected === 'posts' ?
                                    <div className='flex text-[black] border-t-2 border-t-black cursor-pointer py-3 justify-center items-center gap-2 w-[100px]'>
                                        <BsGrid3X3 />
                                        <p className='font-medium text-sm'>POSTS</p>
                                    </div>
                                    :
                                    <div onClick={onSelectPosts} className='flex text-[#8e8e8e] cursor-pointer py-3 justify-center items-center gap-2 w-[100px]'>
                                        <BsGrid3X3 />
                                        <p className='font-medium text-sm'>POSTS</p>
                                    </div>
                            }

                            {
                                selected === 'save' ?
                                    <div className='flex text-[black] border-t-2 border-t-black cursor-pointer py-3 justify-center items-center gap-2 w-[100px]'>
                                        <MdSlowMotionVideo className='text-xl' />
                                        <p className='font-medium text-sm'>SAVE</p>
                                    </div>
                                    :
                                    <div onClick={onSelectSave} className='flex text-[#8e8e8e] cursor-pointer py-3 justify-center items-center gap-2 w-[100px]'>
                                        <MdSlowMotionVideo className='text-xl' />
                                        <p className='font-medium text-sm'>SAVE</p>
                                    </div>
                            }

                            {
                                selected === 'tagged' ?
                                    <div className='flex text-[black] border-t-2 border-t-black cursor-pointer py-3 justify-center items-center gap-2 w-[100px]'>
                                        <AiOutlineTag />
                                        <p className='font-medium text-sm'>TAGGED</p>
                                    </div>
                                    :
                                    <div onClick={onSelectTagged} className='flex text-[#8e8e8e] cursor-pointer py-3 justify-center items-center gap-2 w-[100px]'>
                                        <AiOutlineTag />
                                        <p className='font-medium text-sm'>TAGGED</p>
                                    </div>
                            }

                        </div>
                        <div className='flex w-[100%] flex-wrap'>
                            {
                                profile.postList.map(post => <PostItem key={post._id} postInfo={post} profile={profile} />)
                            }
                        </div>

                    </div>
                </div>
            </div>
            {onUpdateAvatar && isSeftProfile ? <PopupUpdateAvatar onClose={onSelectUpdateAvatar} updateAvatar={updateAvatar} /> : undefined}
            {followSelectPopup === 'Followers' ? <FollowListPopup onClose={onSelectFollowPopup} list={followSelectPopup} /> : undefined}
            {followSelectPopup === 'Following' ? <FollowListPopup onClose={onSelectFollowPopup} list={followSelectPopup} /> : undefined}
        </>
    )
}

export default Profile