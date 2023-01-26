import React from 'react'
import srcDemo from "../../images/308_4122.jpg"

function StoryItem({ width }) {
    return (
        <div className={`w-[${width}] h-[${width}] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
            <img loading="lazy" src={srcDemo} alt="" className='w-full h-full object-cover rounded-full' />
        </div>
    )
}

export default StoryItem