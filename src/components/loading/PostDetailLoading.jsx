import React from 'react'
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import { FaRegSmile } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { TbMessageCircle2 } from 'react-icons/tb'

function PostDetailLoading({ onClickClose }) {
    return (
        <div className='xl:w-[100%] xl:pl-0 md:w-full md:pl-[75px] z-[60] top-0 right-0 w-full h-full  bg-[#59595968] fixed'>
            <div className='w-full h-full p-3 flex justify-center items-center' >
                <IoClose onClick={onClickClose} className='text-3xl right-3 top-3 absolute text-white hover:cursor-pointer' />
                {/* Image list */}
                <div className='container flex box-content animate-waving-hand overflow-hidden min-h-[590px] bg-white xl:w-[65%] lg:w-[90%] w-[90%] md:h-[85%] xl:h-[70%] rounded-xl h-[80%]'>
                    <div className='w-[100%] md:w-[40%] h-full bg-[#dddddd] animate-pulse'>

                    </div>

                    <div className='w-[60%] h-full hidden md:block'>
                        {/* Header */}
                        <div className='w-full h-14 bg-white px-3 flex justify-between border-b'>
                            <div className='xl:w-[40%] w-[40%] h-full flex items-center'>
                                <div className={`w-[41px] h-[41px] bg-[#dddddd] animate-pulse p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                </div>
                                <div className='w-[30%] ml-2 h-5 bg-[#dddddd] animate-pulse'></div>
                            </div>
                            <div className='flex items-center cursor-pointer'>
                                <BsThreeDots className='text-lg' />
                            </div>
                        </div>

                        <div className='w-full h-[396px]' >
                            {/* Comment */}
                            <div className='flex justify-center items-center w-full h-full'>
                                <div className="h-[60px] w-[60px] rounded-full p-2 border-2 animate-spin border-t-[#dddddd] border-t-1 ">
                                </div>
                            </div>

                        </div>

                        <div className='w-full h-auto bg-white border-t'>
                            {/* React */}
                            <div className='w-full h-11 px-3'>
                                <div className='w-[22%] h-full items-center float-left justify-between flex'>
                                    <div className='w-[100%] h-5 bg-[#dddddd] animate-pulse'></div>
                                </div>
                                <div className='h-full items-center float-right flex'>

                                </div>
                            </div>

                            {/* Likes */}
                            <div className='w-[10%] ml-3 h-5 bg-[#dddddd] animate-pulse'></div>

                            <div className='w-[30%] ml-3 mt-1 h-5 bg-[#dddddd] animate-pulse'></div>

                            {/* Comments */}
                            <div className='w-full px-3 h-[50px] flex justify-between items-center'>
                                <FaRegSmile className='text-2xl cursor-pointer' />
                                <input type="text" className='w-[80%] bg-transparent outline-none border-none text-base' placeholder='Add a comment...' />
                                <h1 className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Post</h1>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailLoading