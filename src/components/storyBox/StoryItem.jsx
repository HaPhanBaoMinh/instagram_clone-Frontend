import React from 'react'
import srcDemo from "../../images/images.jfif"

function StoryItem({ width }) {
    return (
        <div className={`w-[58px] h-[58px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
            <img loading="lazy" src={srcDemo} alt="" className='w-full h-full object-cover rounded-full' />
        </div>
    )
}

export default StoryItem