import React from 'react'
import ROUTER from '../../api/router';
import srcLogo from "../../images/308_4122.jpg"
import { Link } from 'react-router-dom';

function NotificationItem({ user, post, onClick, type }) {
    return (
        <Link to={`/post/${post._id}`} >
            <div onClick={onClick} className='w-full px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all'>
                <img loading="lazy" src={srcLogo} alt="" className='w-[40px] h-[40px] object-cover rounded-full' />
                <p className='text-sm w-[70%]'>
                    <span className='font-medium'>{user.username} </span>
                    {type}</p>
                <img loading="lazy" src={`${ROUTER}/image/${post.images[0].filename}`} alt="" className='w-[40px] h-[40px] object-cover' />
            </div>
        </Link>
    )
}

export default NotificationItem