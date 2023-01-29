import React, { useContext, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import instanceAxios from '../../api/axiosConfig';
import AuthContext from '../../context/AuthProvider';
import SearchMessageUser from './SearchMessageUser';
import { v4 as uuidv4 } from 'uuid';

const CreateNewConverstation = ({ onClickPopup, setSelectConverstationUser, setchatList }) => {
    const { Auth } = useContext(AuthContext);
    const [FollowingUser, setFollowingUser] = useState([]);

    const onSelectSendNewMessage = (user) => {
        setSelectConverstationUser(user);
        setchatList(list => {
            if (list.find(chat => chat.user._id === user._id)) {
                return list
            }
            return [...list, { user }]
        })
        onClickPopup();
    }

    useEffect(() => {
        const getFollowingUser = async () => {
            try {
                const result = await instanceAxios.get(`/user/following/${Auth._id}`);
                if (result.data.status) {
                    setFollowingUser(result.data.result);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        if (Auth) {
            getFollowingUser();
        }
    }, [])


    return (
        <div className='xl:w-[100%] xl:pl-0 md:w-full md:pl-[75px] flex justify-center items-center z-[60] top-0 right-0 w-full h-full  bg-[#59595968] fixed'>
            <IoClose onClick={onClickPopup} className='text-3xl right-3 top-3 absolute text-white hover:cursor-pointer' />

            <div className='container box-border animate-waving-hand overflow-hidden min-h-[500px] bg-white xl:w-[30%] lg:w-[40%] w-[80%] md:w-[60%] md:h-[85%] xl:h-[70%] rounded-xl h-[80%]'>
                <div className='w-full px-4 h-[10%] flex items-center justify-center'>
                    <h3 className='font-medium'>New message</h3>
                </div>
                <div className='h-[90%] w-full'>
                    {FollowingUser.map(following => <SearchMessageUser onClick={onSelectSendNewMessage} key={uuidv4()} result={following.user} />)}
                </div>
            </div>
        </div>
    )
}

export default CreateNewConverstation