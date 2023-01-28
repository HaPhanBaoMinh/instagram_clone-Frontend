import React from 'react'
import Feed from '../newsFeed/Feed'
import srcDemo from "../../images/308_4122.jpg"
import { TbMessageCircle2 } from 'react-icons/tb'
import { AiOutlineShareAlt } from 'react-icons/ai'
import { FaRegSmile } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'

function HomeLoading() {
    return (
        <div id='feeds' className='w-full flex flex-col gap-3 max-w-[470px] xl:float-left mx-auto h-full lg:mx-auto xl:mr-3'>
            {/* <div className='w-full h-[110px] flex justify-between border mt-3 bg-white px-4 rounded-lg py-1'>
                <div className='h-full flex-col justify-center w-fit flex items-center'>
                    <div className={`animate-pulse w-[50px] h-[50px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    </div>
                    <div className='w-[100%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                </div>

                <div className='h-full flex-col justify-center w-fit flex items-center'>
                    <div className={`animate-pulse w-[50px] h-[50px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    </div>
                    <div className='w-[100%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                </div>

                <div className='h-full flex-col justify-center w-fit flex items-center'>
                    <div className={`animate-pulse w-[50px] h-[50px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    </div>
                    <div className='w-[100%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                </div>

                <div className='h-full flex-col justify-center w-fit flex items-center'>
                    <div className={`animate-pulse w-[50px] h-[50px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    </div>
                    <div className='w-[100%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                </div>

                <div className='h-full flex-col justify-center w-fit flex items-center'>
                    <div className={`animate-pulse w-[50px] h-[50px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    </div>
                    <div className='w-[100%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                </div>

                <div className='h-full flex-col justify-center w-fit flex items-center'>
                    <div className={`animate-pulse w-[50px] h-[50px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    </div>
                    <div className='w-[100%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                </div>
            </div> */}
            <div className='w-full h-[85%]'>
                <div className='w-full mb-3 box-content overflow-hidden rounded-lg border'>
                    {/* Header */}
                    <div className='w-full h-14 bg-white px-3 flex justify-between border-b'>
                        <div className='w-full h-full flex gap-2 items-center'>
                            <div className={`animate-pulse w-[45px] h-[45px] bg-[#c7c7c7] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            </div>
                            <div className='w-[15%] h-3 mt-1 bg-[#dddddd] animate-pulse'></div>
                        </div>
                        <div className='flex items-center cursor-pointer'>
                            <BsThreeDots className='text-lg' />
                        </div>
                    </div>
                    {/* Images */}
                    <div className='w-full h-[587px] bg-[#dddddd] animate-pulse flex justify-center'>

                    </div>

                    {/* Reaction */}

                    {/* Like */}
                    <div className='w-[15%] h-4 mt-3 mx-3 bg-[#c7c7c7] animate-pulse'> </div>
                    <div className='w-[90%] h-4 mt-2 mx-3 bg-[#c7c7c7] animate-pulse'> </div>
                    <div className='w-[50%] h-4 mt-1 mx-3 bg-[#c7c7c7] animate-pulse'> </div>

                    <div className='w-[10%] h-4 mt-1 mx-3 bg-[#c7c7c7] animate-pulse'> </div>
                    <div className='w-[16%] h-4 mt-1 mx-3 bg-[#c7c7c7] animate-pulse'> </div>

                    <div className='w-full px-3 h-[50px] animate-pulse flex justify-between items-center'>
                        <FaRegSmile className='text-2xl cursor-pointer' />
                        <input type="text" className='w-[80%] outline-none bg-transparent border-none text-base' placeholder='Add a comment...' />
                        <h1 className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Post</h1>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HomeLoading