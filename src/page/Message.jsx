import React, { useEffect } from 'react'
import ChatContainer from '../components/ChatContainer/ChatContainer'
import { SocketProvider } from '../context/SocketProvider'

function Message() {
    useEffect(() => {
        document.title = "Inbox • Chats"
    }, [])

    return (
        // <SocketProvider>
        <div className='xl:w-[84%] pb-[60px] md:pb-0 flex justify-center items-center xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-full bg-[#fafafafa]'>
            <ChatContainer />
        </div>
        // </SocketProvider>
    )
}

export default Message