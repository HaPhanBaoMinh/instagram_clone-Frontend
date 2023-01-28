import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import instanceAxios from '../../api/axios'
import ROUTER from '../../api/router'
import AuthContext from '../../context/AuthProvider';

function SuggesUser({ user }) {
    const { Auth } = useContext(AuthContext);
    const [isLoading, setisLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const onFollowuser = async () => {
        try {
            const data = {
                user_id: Auth._id,
                follower_id: user._id
            }
            const result = await instanceAxios.post('/user/follow', data);
            if (result.data.status) {
                setIsFollowing(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onUnFollowuser = async () => {
        try {
            const data = {
                user_id: Auth._id,
                follower_id: user._id
            }
            const result = await instanceAxios.post('/user/unfollow', data);
            if (result.data.status) {
                setIsFollowing(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex w-full gap-6 items h-fit items-center mt-3'>
            <div className={`md:w-[40px] md:h-[40px] w-[50px] h-[50px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                <img loading="lazy" src={`${ROUTER}/image/${user.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
            </div>
            <div>
                <Link to={`/user/${user.username}`} className='text-sm font-medium'> {user.username} </Link>
                <p className='text-sm text-gray-500'> {user.name} </p>
            </div>

            {
                !isFollowing ?
                    <button onClick={onFollowuser} className='text-blue-500 font-medium text-sm ml-auto hover:text-blue-800 transition-all'>
                        {isLoading ?
                            <div className="h-[10%] w-[10%] rounded-full p-2 border-2 animate-spin border-t-blue-400 border-t-1 ">
                            </div>
                            : "Follow"
                        }
                    </button>
                    :
                    <button onClick={onUnFollowuser} className='text-gray-500 font-medium text-sm ml-auto transition-all'>
                        Following
                    </button>
            }
        </div>
    )
}

export default SuggesUser