import React, { useContext, useEffect, useState } from 'react'
import instanceAxios from '../../api/axios';
import ROUTER from '../../api/router';
import AuthContext from '../../context/AuthProvider';
import Loading from '../loading/Loading';
import SuggesUser from './SuggesUser';

function Suggestions() {
    const { Auth, setAuth } = useContext(AuthContext);
    const [suggestionList, setSuggestionList] = useState([]);

    const getSuggestionList = async () => {
        try {
            const result = await instanceAxios.get(`/user/suggestion/${Auth._id}`);
            if (result.data.status) {
                setSuggestionList(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (Auth) {
            getSuggestionList();
        }
    }, [Auth])


    if (!Auth) return (
        <div className='w-[500px]  h-[500px] m-auto'>
            <Loading />
        </div>
    )

    return (
        <div className='max-w-[319px] hidden xl:block h-screen float-right w-full'>
            <div className='flex w-full gap-6 items h-fit items-center'>
                <div className={`md:w-[55px] md:h-[55px] w-[50px] h-[50px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    <img loading="lazy" src={`${ROUTER}/image/${Auth.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                </div>
                <div>
                    <p className='text-sm font-medium'> {Auth.username} </p>
                    <p className='text-sm text-gray-500'> {Auth.name} </p>
                </div>
            </div>
            <h4 className='font-medium text-sm py-2 text-gray-500'>Suggestions for you</h4>

            {/* User list */}
            <div className='w-full h-fit'>
                {suggestionList.map(sugges => <SuggesUser key={sugges._id} user={sugges} />)}
            </div>
        </div>
    )
}

export default Suggestions