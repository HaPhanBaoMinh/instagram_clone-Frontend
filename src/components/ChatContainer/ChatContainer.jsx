import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FiEdit, FiSend } from "react-icons/fi";
import srcLogo from "../../images/313399065_1027735465289593_7195031916021187795_n.jpg";
import { BsCameraVideo, BsInfoCircle, BsTelephone } from 'react-icons/bs';
import RecipientUser from './RecipientUser';
import instanceAxios from '../../api/axiosConfig';
import AuthContext from '../../context/AuthProvider';
import ROUTER from '../../api/router';
import ChatboxLoading from "../loading/ChatboxLoading"
import { FaRegSmile } from 'react-icons/fa';
import Message from './Message';
import SocketContext from '../../context/SocketProvider';
import { v4 as uuidv4 } from 'uuid';
import CreateNewConverstation from './CreateNewConverstation';

function ChatContainer() {
    const { Auth } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [chatList, setchatList] = useState([]);
    const [selectConverstationUser, setSelectConverstationUser] = useState("");
    const [messageList, setMessageList] = useState([]);
    const message = useRef("");
    const [popupConverstation, setPopupConverstation] = useState(false);
    const scrollRef = useRef(null);
    const [newConverstation, setNewConverstation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getChatList = async () => {
            try {
                const result = await instanceAxios(`/chat/${Auth._id}`)
                if (result.data.status) {
                    setchatList(result.data.result);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        if (Auth) {
            getChatList();
        }
    }, [Auth, newConverstation])

    useEffect(() => {
        if (!selectConverstationUser) return;
        // setCurrentChatUser(chatList.find(user => user._id === selectConverstationUser.user._id))
        const getMessageList = async () => {
            const data = {
                sender_id: Auth._id,
                recipient_id: selectConverstationUser._id
            }
            const messageList = await instanceAxios.post("/chat/message", data);
            setMessageList(messageList.data.message);
        }

        getMessageList();
    }, [selectConverstationUser])

    useEffect(() => {
        if (socket) {
            socket.on("message_recieve", (newMessage) => {
                if (!chatList.length || chatList.some(info => info.user._id !== newMessage.sender_id)) {
                    setNewConverstation(true);
                } else {
                    setNewConverstation(false);
                }
                setMessageList(message => [...message, newMessage]);
                // setchatList(chatList => notification(chatList, newMessage.sender_id, true))
            })
        }
    }, [socket])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const onClickPopup = () => {
        setPopupConverstation(!popupConverstation);
    }

    const onSelectConverstationUser = (user) => {
        setSelectConverstationUser(user);
        // setchatList(chatList => notification(chatList, user._id, false))
    }

    const onSendMessage = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const data = {
            sender_id: Auth._id,
            recipient_id: selectConverstationUser._id,
            message: message.current.value
        }
        const result = await instanceAxios.post("/chat", data);
        if (result.data.status) {
            setMessageList(list => [...list, result.data.insert]);
        }
        socket.emit("send_message", data)
        message.current.value = ""
        setIsLoading(false);

    }

    if (!Auth) {
        return <ChatboxLoading />
    }

    return (
        <>
            <div className='max-w-[935px] w-[95%] h-[95%] rounded-sm overflow-hidden border box-border'>
                <div className='w-[35%] h-full bg-slate-300 float-left border-r'>
                    <div className='w-full h-[10%] bg-white border-b flex items-center px-4'>
                        <div className='flex gap-1 m-auto items-center w-[50%]'>
                            <h3 className='font-medium'> {Auth.username} </h3>
                            <IoIosArrowDown className='text-2xl cursor-pointer mt-1' />
                        </div>
                        <FiEdit className='text-2xl cursor-pointer' onClick={onClickPopup} />
                    </div>
                    <div className='h-[90%] w-full bg-white'>
                        {
                            chatList.map(recipient => <RecipientUser key={uuidv4()} recipient={recipient} selected_id={selectConverstationUser._id} onSelect={onSelectConverstationUser} />)
                        }

                    </div>
                </div>

                {
                    selectConverstationUser ?
                        <div className='w-[65%] h-full float-right'>
                            <div className='w-full mr-auto h-[10%] flex items-center justify-between border-b px-4 bg-white'>
                                <div className='flex gap-1 h-fit w-[40%]'>
                                    <div className='w-[26px] h-[26px] rounded-full bg-slate-800'>
                                        <img loading="lazy" src={`${ROUTER}/image/${selectConverstationUser.avatar}`} alt="avatar" srcSet="" className='w-full h-full object-cover rounded-full' />
                                    </div>
                                    <p href='/' className='font-medium hover:text-[#616161] transition-all'>{selectConverstationUser.username}</p>
                                </div>
                                <div className='w-[40%] h-full items-center justify-end flex gap-4'>
                                    <BsTelephone className='text-2xl cursor-pointer' />
                                    <BsCameraVideo className='text-2xl cursor-pointer' />
                                    <BsInfoCircle className='text-2xl cursor-pointer' />
                                </div>
                            </div>

                            <div className='w-full h-[90%] bg-white'>
                                {/* message box */}

                                <div className='h-[92%] overflow-auto w-full px-4'>
                                    {
                                        messageList.map(message => <Message key={uuidv4()} message={message} recipientUser={selectConverstationUser} senderUser={Auth} />)
                                    }
                                    <div className='w-full h-[10px]' ref={scrollRef} />
                                </div>

                                {/* input box */}
                                <form onSubmit={e => onSendMessage(e)} className='w-full px-3 h-[50px] flex justify-between items-center bg-white'>
                                    <FaRegSmile className='text-2xl cursor-pointer' />
                                    <input ref={message} type="text" className='w-[80%] bg-transparent outline-none border-none text-base' placeholder='Add a comment...' />
                                    <h1 onClick={e => onSendMessage(e)} className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>
                                        {
                                            isLoading ?
                                                <div className="h-[10px] m-auto w-[10px] rounded-full p-2 border-2 animate-spin border-t-blue-500 border-t-1 ">
                                                </div>
                                                : "Send"
                                        }
                                    </h1>
                                </form>
                            </div>
                        </div>
                        :
                        <div className='w-[65%] bg-white h-full float-right flex items-center justify-center flex-col'>
                            <div className='p-6 border-black border-2 w-fit rounded-full'>
                                <FiSend className='text-3xl' />
                            </div>
                            <h3 className='text-2xl'>Your Messages</h3>
                            <p className='text-gray-400'>Send private photos and messages to a friend or group.</p>
                            <button onClick={onClickPopup} className='animation-waving-hand font-medium mt-2
                        cursor-pointer flex items-center justify-center transition-all hover:bg-blue-500 text-sm bg-blue-400 text-white px-3 h-[35px] rounded-md'>Send Message</button>
                        </div>
                }
            </div>
            {popupConverstation ? <CreateNewConverstation setchatList={setchatList} setSelectConverstationUser={setSelectConverstationUser} onClickPopup={onClickPopup} /> : undefined}
        </>
    )
}

export default ChatContainer