import React, { memo, useEffect, useState } from 'react'
import ROUTER from '../../api/router';

const Message = memo(({ senderUser, recipientUser, message }) => {
    const [isMyMessage, setIsMyMessage] = useState(false);

    useEffect(() => {
        if (!senderUser || !recipientUser || !message) return;
        if (message.sender_id === senderUser._id) {
            setIsMyMessage(true);
        } else {
            setIsMyMessage(false);
        }
    }, [])

    if (!isMyMessage) {
        return (
            <div className='w-auto py-2 gap-2 flex items-start'>
                <div className='w-[30px] h-[30px] bg-black rounded-full'>
                    <img loading="lazy" src={`${ROUTER}/image/${recipientUser.avatar}`} alt="avatar" srcSet="" className='w-full h-full object-cover rounded-full' />
                </div>
                <div className='px-2 py-1 max-w-[50%] w-fit border rounded-md'>
                    <p className='break-words'> {message.message} </p>
                </div>
            </div>
        )
    } else {
        return (
            <div className='w-auto py-2 gap-2 flex items-start justify-end'>
                <div className='px-2 py-1 max-w-[50%] w-fit border rounded-md bg-[#efefef]'>
                    <p className='break-words'> {message.message} </p>
                </div>
            </div>
        )
    }
})

export default Message