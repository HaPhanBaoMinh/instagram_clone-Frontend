import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Mousewheel, Keyboard } from "swiper";

import srcDemo from "../../images/308_4122.jpg"
import StoryItem from './StoryItem';

function StoryBox() {
    return (
        <div className='w-full h-[110px] border mt-3 bg-white rounded-lg py-1'>
            <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Mousewheel, Keyboard]}
                className="w-full h-full flex items-center"
                slidesPerView={6}
                slidesPerGroup={3}
            >
                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <StoryItem width={"58px"} />
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <StoryItem width={"58px"} />
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <StoryItem width={"58px"} />
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <StoryItem width={"58px"} />
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <StoryItem width={"58px"} />
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <StoryItem width={"58px"} />
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <div className='w-[58px] h-[58px]  border-[2px] p-[2px] rounded-full flex justify-center items-center'>
                        <img loading="lazy" src={srcDemo} alt="" className='w-full h-full object-cover rounded-full' />
                    </div>
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

                <SwiperSlide className='w-full h-full cursor-pointer flex flex-col justify-center items-center'>
                    <div className='w-[58px] h-[58px]  border-[2px] p-[2px] rounded-full flex justify-center items-center'>
                        <img loading="lazy" src={srcDemo} alt="" className='w-full h-full object-cover rounded-full' />
                    </div>
                    <h4 className='text-xs font-thin'>Intagram</h4>
                </SwiperSlide>

            </Swiper>
        </div>
    )
}

export default StoryBox