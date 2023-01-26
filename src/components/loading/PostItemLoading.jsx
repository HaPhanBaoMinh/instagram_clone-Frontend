import React from 'react'
import { AiFillHeart, AiFillMessage } from 'react-icons/ai'

function PostItemLoading() {
    return (
        <div className="w-1/3 px-1 md:px-3 cursor-pointer bg-[#dddddd] group overflow-hidden animate-pulse">
            <div className='w-full h-full justify-center relative top-[-100%] opacity-0 group-hover:opacity-100 flex'>

            </div>
        </div>
    )
}

export default PostItemLoading