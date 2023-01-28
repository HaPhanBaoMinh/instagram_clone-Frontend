import React, { useEffect, useState } from 'react'
import instanceAxios from '../api/axios'
import FeedsContainer from '../components/newsFeed/FeedsContainer'
import Suggestions from '../components/suggestions/Suggestions'

function Home() {
    // const [data, setdata] = useState()
    // const onGetData = async () => {
    //     const result = await instanceAxios.get('/data');
    //     setdata(result.data)
    // }
    useEffect(() => {
        document.title = "Instagram"
    }, [])

    return (
        // xl:w-[16%] md:w-[75px] w-[100vw] 
        <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-auto bg-[#fafafafa]'>
            {/* <h1>Home</h1>
            <button onClick={onGetData}>Get data</button>
            {data ? <h1>{data}</h1> : undefined} */}
            <canvas id='myCanvas' className="hidden" />

            <div className='max-w-[821px] h-auto mx-auto my-5'>
                <FeedsContainer />
                <Suggestions />
            </div>

        </div>

    )
}

export default Home