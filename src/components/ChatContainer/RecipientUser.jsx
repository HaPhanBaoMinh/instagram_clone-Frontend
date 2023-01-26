import React, { useEffect, useState } from 'react'
import { BsDot } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import ROUTER from '../../api/router';
import srcLogo from "../../images/313399065_1027735465289593_7195031916021187795_n.jpg";
import { removeMessageNotificationAction } from '../../redux-action/messageNotificationAction';

function RecipientUser({ recipient, onSelect, selected_id }) {
    const dispath = useDispatch();
    const newMessageInfo = useSelector(state => state.messageNotification);
    const [isNewMessage, setIsNewMessage] = useState(false);

    useEffect(() => {
        if (newMessageInfo) {
            setIsNewMessage(newMessageInfo.some(id => id === recipient.user._id));
        }
    }, [newMessageInfo])


    return (
        <div onClick={() => {
            onSelect(recipient.user);
            dispath(removeMessageNotificationAction(recipient.user._id));
        }} className={selected_id === recipient.user._id ? 'w-full h-16 px-2 lg:px-4 flex items-center gap-2 bg-[#fafafa] cursor-pointer transition-all' : 'w-full h-16 px-4 flex items-center gap-2 hover:bg-[#fafafa] cursor-pointer transition-all'}>
            <div className={`w-[41px] h-[41px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                <img loading="lazy" src={`${ROUTER}/image/${recipient.user.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
            </div>
            <div className='w-[70%] h-full flex flex-col justify-center'>
                <p href="/" className='text-sm font-medium hover:text-[#616161] transition-all'> {recipient.user.username} </p>
                <p className='text-[#616161] text-sm'> {recipient.user.name} </p>
            </div>
            {
                isNewMessage ?
                    <BsDot className='text-xl text-red-500' />
                    : undefined
            }
        </div>
    )
}

export default RecipientUser