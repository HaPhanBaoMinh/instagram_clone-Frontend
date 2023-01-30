import React, { useContext, useEffect, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import instanceAxios from '../../api/axiosConfig';
import AuthContext from '../../context/AuthProvider';
import FollowUser from './FollowUser'
import { v4 as uuidv4 } from 'uuid';

function FollowListPopup({ onClose, list, profile }) {
    const { Auth } = useContext(AuthContext);
    const [follower, setFollower] = useState([]);

    const getFollowerUser = async () => {
        try {
            const result = await instanceAxios.get(`/user/follower/${profile._id}`);
            console.log(result);
            if (result.data.status) {
                setFollower(result.data.result);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const getFollowingUser = async () => {
        try {
            const result = await instanceAxios.get(`/user/following/${profile._id}`);
            if (result.data.status) {
                setFollower(result.data.result);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        if (!profile) return;
        if (list === 'Followers') {
            getFollowerUser();
        }

        if (list === 'Following') {
            getFollowingUser();
        }

    }, [profile])


    return (
        <div className='xl:w-[100%] xl:pl-0 md:w-full md:pl-[75px] z-[60] flex justify-center items-center top-0 right-0 w-full h-full  bg-[#59595968] fixed'>
            <div className='w-[400px] relative animate-waving-hand h-[450px] bg-white rounded-md overflow-hidden'>
                {/* header */}
                <div className='w-full justify-center items-center flex h-10 border-b-[1px] '>
                    <h5 className='font-medium'> {list} </h5>
                    <span className='absolute right-[7px] top-[7px]'>
                        <IoCloseSharp onClick={() => onClose(null)} className='text-2xl cursor-pointer' />
                    </span>
                </div>

                {/* Follower list */}
                <div className='w-full h-[90%]'>
                    {
                        follower.map(follow => <FollowUser key={uuidv4()} list={list} onClose={onClose} user={follow.user} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default FollowListPopup