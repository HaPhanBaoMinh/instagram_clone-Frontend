import React from 'react'
import { Link } from 'react-router-dom';
import ROUTER from '../../api/router';
import srcDemo from "../../images/images.jfif";

function SearchItem({ result, onClick }) {
    return (
        <Link to={`/user/${result.username}`}>
            <div onClick={onClick} className='w-full h-16 px-4 flex items-center gap-1 hover:bg-[#fafafa] cursor-pointer transition-all'>
                <div className={`w-[41px] h-[41px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    <img loading="lazy" src={`${ROUTER}/image/${result.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                </div>
                <div className='w-[70%] h-full flex flex-col justify-center'>
                    <a href="/" className='text-sm font-medium hover:text-[#616161] transition-all'> {result.username} </a>
                    <p className='text-[#616161] text-sm'> {result.name} </p>
                </div>
            </div>
        </Link>
    )
}

export default SearchItem