import React from 'react'
import ROUTER from '../../api/router'

function SearchMessageUser({ onClick, result }) {
    return (
        <div className='w-full h-16 px-4 flex items-center gap-1 transition-all'>
            <div className={`w-[41px] h-[41px] border-red-400 border-[2px] p-[2px] rounded-full flex justify-center items-center`}>
                <img loading="lazy" src={`${ROUTER}/image/${result.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
            </div>
            <div className='w-[70%] h-full flex flex-col justify-center'>
                <a href="/" className='text-sm font-medium hover:text-[#616161] transition-all'> {result.username} </a>
                <p className='text-[#616161] text-sm'> {result.name} </p>
            </div>
            <h3 onClick={() => onClick(result)} className='font-medium cursor-pointer ml-auto text-blue-400 hover:text-blue-500 transition-all'>
                Send
            </h3>
        </div>
    )
}

export default SearchMessageUser