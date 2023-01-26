import React, { useContext, useEffect, useState } from 'react'
import StoryBox from '../storyBox/StoryBox'
import Feed from './Feed'
import AuthContext from '../../context/AuthProvider';
import instanceAxios from '../../api/axios';
import HomeLoading from '../loading/HomeLoading';
import { v4 as uuidv4 } from 'uuid';

function FeedsContainer() {
    const { Auth } = useContext(AuthContext);
    const [feeds, setFeeds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getFeeds = async () => {
            setIsLoading(true);
            if (!Auth) return;
            const result = await instanceAxios.get(`/feed/${Auth._id}`);
            if (result.data.status) {
                setFeeds(result.data.postInfo);
                setIsLoading(false);
            }
        }

        getFeeds();

    }, [Auth])

    if (isLoading) {
        return <HomeLoading />
    }



    return (
        <div id='feeds' className='w-full flex flex-col gap-3 max-w-[470px] xl:float-left mx-auto h-full lg:mx-auto xl:mr-3'>
            <StoryBox />
            <div className='w-full h-[85%]'>
                {
                    feeds.map(feed => <Feed key={uuidv4()} feed={feed} />)
                }
                {
                    !feeds.length && !isLoading ?
                        <div className='w-full h-[100px] m-auto'>
                            <h1 className='font-medium text-2xl text-center'>You don't have any new feed!</h1>
                            <p className='text-lg text-center text-gray-500'> Start find first followers </p>
                        </div>
                        : undefined
                }
            </div>
        </div>
    )
}

export default FeedsContainer