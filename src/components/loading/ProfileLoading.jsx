import React from 'react'
import { AiOutlineSetting } from 'react-icons/ai'
import { HiOutlinePlus } from 'react-icons/hi'
import Loading from './Loading'

function ProfileLoading() {
    return (
        <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-full bg-[#fafafafa]'>
            <div className='max-w-[975px] h-full m-auto'>
                <div className='md:w-full h-1/2 md:px-11 md:pb-[30px] box-content px-4 w-auto'>
                    {/* User info */}
                    <div className='h-1/2 w-full pt-6 gap-2 flex'>
                        {/* Logo */}
                        <div className='w-[30%] h-full flex items-center'>
                            <div className={`md:w-[150px] md:h-[150px] w-[100px] h-[100px] bg-[#dddddd] animate-pulse p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            </div>
                        </div>
                        <div className='w-[70%] h-full'>
                            <div className='w-full h-[30%] items-center flex gap-5'>
                                <div className='w-[20%] h-7 bg-[#dddddd] animate-pulse'></div>
                                <div className='w-[10%] h-7 bg-[#dddddd] animate-pulse'></div>
                                <div className='w-[5%] h-7 bg-[#dddddd] animate-pulse'></div>
                            </div>
                            <div className='w-full gap-2 md:gap-4 flex mt-4'>
                                <div className='w-[15%] h-7 bg-[#dddddd] animate-pulse'></div>
                                <div className='w-[15%] h-7 bg-[#dddddd] animate-pulse'></div>
                                <div className='w-[15%] h-7 bg-[#dddddd] animate-pulse'></div>
                            </div>

                            <div className='mt-2'>
                                {/* <h4 className='font-medium'>{profile.name}</h4> */}
                                {/* <p className='w-full text-left font-light text-sm whitespace-pre-line'> {profile.bio} </p> */}
                            </div>
                        </div>
                    </div>

                    <div className='h-1/2 w-full pt-6 flex items-center gap-10 overflow-auto'>
                        <div className='w-fit justify-center items-center flex flex-col animate-pulse'>
                            <div className={`w-[77px] h-[77px] border-[#c7c7c7] border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                                <HiOutlinePlus className='text-[#c7c7c7] text-3xl' />
                            </div>
                            <p className='text-sm font-medium text-[#c7c7c7]'>New</p>
                        </div>

                        <div className='w-fit justify-center items-center flex flex-col animate-pulse'>
                            <div className={`w-[77px] h-[77px] bg-[#dddddd] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            </div>
                            <div className='w-[100%] mt-1 h-4 bg-[#dddddd] animate-pulse'></div>
                        </div>

                        <div className='w-fit justify-center items-center flex flex-col animate-pulse'>
                            <div className={`w-[77px] h-[77px] bg-[#dddddd] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            </div>
                            <div className='w-[100%] mt-1 h-4 bg-[#dddddd] animate-pulse'></div>
                        </div>

                        <div className='w-fit justify-center items-center flex flex-col animate-pulse'>
                            <div className={`w-[77px] h-[77px] bg-[#dddddd] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            </div>
                            <div className='w-[100%] mt-1 h-4 bg-[#dddddd] animate-pulse'></div>
                        </div>

                        <div className='w-fit justify-center items-center flex flex-col animate-pulse'>
                            <div className={`w-[77px] h-[77px] bg-[#dddddd] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                            </div>
                            <div className='w-[100%] mt-1 h-4 bg-[#dddddd] animate-pulse'></div>
                        </div>

                    </div>
                </div>

                <div className='w-full h-1/2 border-t-2'>
                    <div className='flex justify-center items-center w-full h-full'>
                        <div className="h-[60px] w-[60px] rounded-full p-2 border-2 animate-spin border-t-[#dddddd] border-t-1 ">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileLoading