import React, { memo, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import instanceAxios from '../../api/axios';
import ROUTER from '../../api/router';
import AuthContext from '../../context/AuthProvider';

const FollowUser = ({ user, onClose, list }) => {
    const [unFollow, setUnFollow] = useState(false);
    const { Auth } = useContext(AuthContext);

    const onUnFollow = async () => {
        if (!Auth) return;
        let data;

        if (list === "Followers") {
            data = {
                user_id: user._id,
                follower_id: Auth._id,
            }
        }

        if (list === "Following") {
            data = {
                user_id: Auth._id,
                follower_id: user._id,
            }
        }

        try {
            const result = await instanceAxios.post("/user/unfollow", data);
            if (result.data.status) {
                setUnFollow(true);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='flex w-full gap-6 items h-fit items-center px-4 mt-2'>
            <div className={`md:w-[40px] md:h-[40px] w-[50px] h-[50px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                <img loading="lazy" src={`${ROUTER}/image/${user.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
            </div>
            <div>
                <Link onClick={() => onClose(null)} to={`/user/${user.username}`} className='text-sm font-medium'> {user.username} </Link>
                <p className='text-sm text-gray-500'> {user.name} </p>
            </div>

            {
                unFollow ?
                    <button className='text-gray-500 cursor-default font-medium text-sm ml-auto'>
                        Removed
                    </button> :
                    <button onClick={onUnFollow} className='text-blue-500 font-medium text-sm ml-auto hover:text-blue-800 transition-all'>
                        Remove
                    </button>
            }
        </div>
    )
}

export default FollowUser