import React, { useContext, useEffect, useState } from 'react';
import srcLogo from "../../images/Instagram_logo.svg.png";
import { AiOutlineHome, AiOutlineSearch, AiOutlineMessage, AiOutlineHeart, AiOutlineUser, AiOutlineMenu, AiOutlineFire, AiTwotoneHome, AiFillMessage, AiTwotoneHeart, AiTwotoneFire, AiOutlineSetting, AiOutlineInstagram } from "react-icons/ai";
import { Fragment } from 'react'
import { BsDot, BsMoon } from "react-icons/bs";
import { Menu, Transition } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid';
import { IoIosAddCircle, IoIosAddCircleOutline } from "react-icons/io";
import SearchContainer from '../search/SearchContainer';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import SocketContext from '../../context/SocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { newMessageNotificationAction, resetMessageNotificationAction } from "../../redux-action/messageNotificationAction";
import instanceAxios from '../../api/axios';
import ROUTER from '../../api/router';
import Notification from '../notification/Notification';

function SideBar({ onClickCreate }) {
  const [SelectedIndex, setselectedIndex] = useState(0);
  const [search, setSearch] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationList, setnotificationList] = useState([]);
  const { Auth } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const dispath = useDispatch();
  const newMessageInfo = useSelector(state => state.messageNotification);
  const [isNewNotifiaction, setIsNewNotifiaction] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("message_recieve", (newMessage) => {
        dispath(newMessageNotificationAction(newMessage.sender_id))
      });

      socket.on("notification_like", result => {
        setnotificationList(notification => {
          // if (!notification.find(noti => noti.action_userInfo._id === result.action_userInfo._id && noti.postInfo._id === result.postInfo._id)) {
          if (!notification.find(noti => noti._id === result._id)) {
            return [result, ...notification];
          }
          return notification
        });
        setIsNewNotifiaction(true);
      })

      socket.on("notification_comment", result => {
        console.log(result);
        setnotificationList(notification => {
          // if (!notification.find(noti => noti.action_userInfo._id === result.action_userInfo._id && noti.postInfo._id === result.postInfo._id)) {
          if (!notification.find(noti => noti._id === result._id)) {
            return [result, ...notification];
          }
          return notification
        });
        setIsNewNotifiaction(true);
      })
    }
  }, [socket])

  const getMessageNotification = async () => {
    try {
      const result = await instanceAxios.get(`/chat/notification/${Auth._id}`);
      if (result.data.status) {
        result.data.result.map(message => {
          if (message.newMessage) {
            dispath(newMessageNotificationAction(message.recipient_id))
          }
        })
      }

    } catch (error) {
      console.log(error);
    }
  }

  const getLikeCommentNotification = async () => {
    try {
      const result = await instanceAxios.get(`/notification/${Auth._id}`);
      if (result.data.some(noti => noti.seen === false)) {
        setIsNewNotifiaction(true);
      }
      setnotificationList(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (Auth) {
      getMessageNotification();
      getLikeCommentNotification();
    }
  }, [Auth])

  useEffect(() => {
    if (window.location.href.includes("/message")) {
      setselectedIndex(2);
      return;
    }
    if (window.location.href.includes("/home")) {
      setselectedIndex(0);
      return;
    }
    if (window.location.href.includes("/trending")) {
      setselectedIndex(4);
      return;
    }
    if (window.location.href.includes("/user")) {
      setselectedIndex(6);
      return;
    }
  }, [])

  const onClickSearch = () => {
    setSearch(!search);
  }

  const onClickNotification = () => {
    setNotification(!notification);
    setIsNewNotifiaction(false);
  }

  const onSelectFeature = (index, method = undefined) => {
    setselectedIndex(index);
    if (method) {
      method();
    }
    if (index !== 1) {
      setSearch(false);
    }

    if (index !== 3) {
      setNotification(false);
    }
  }

  const selectList = [
    { logo: <AiOutlineHome className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Home", active: <AiTwotoneHome className='text-3xl md:text-3xl mx-auto md:mx-0' />, path: "/home" },
    { logo: <AiOutlineSearch className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Search", active: <AiOutlineSearch className='text-3xl md:text-3xl mx-auto md:mx-0 font-medium' />, method: onClickSearch },
    { logo: <AiOutlineMessage className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Messages", active: <AiFillMessage className='text-3xl md:text-3xl mx-auto md:mx-0 font-medium' />, path: "/message" },
    { logo: <AiOutlineHeart className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Notifications", active: <AiTwotoneHeart className='text-3xl md:text-3xl mx-auto md:mx-0 font-medium' />, method: onClickNotification },
    { logo: <AiOutlineFire className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Trending", active: <AiTwotoneFire className='text-3xl md:text-3xl mx-auto md:mx-0 font-medium' />, path: "/trending" },
    { logo: <IoIosAddCircleOutline className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Create", active: <IoIosAddCircle className='text-3xl md:text-3xl mx-auto md:mx-0 font-medium' />, method: onClickCreate },
    { logo: <AiOutlineUser className='text-3xl md:text-3xl mx-auto md:mx-0' />, name: "Profile", active: <AiOutlineUser className='text-3xl md:text-3xl mx-auto md:mx-0 font-medium' />, path: `/user/${Auth ? Auth.username : "profile"}` },
  ]

  return (
    <>
      <div className='xl:w-[16%] md:w-[75px] w-[100vw] h-fit fixed bottom-0 md: left-0 border-r md:h-full p-2 md:px-3 md:pt-2 md:pb-5 z-10 bg-white'>

        <div className=' xl:px-3 2xl:px-3 pt-6 pb-4 mx-auto md:block hidden'>
          <AiOutlineInstagram className='xl:hidden 2xl:hidden block text-4xl mx-auto' />
          <img loading="lazy" src={srcLogo} alt="" className='w-[55%] xl:block 2xl:block hidden' />
        </div>

        <div className='mt-0 md:mt-4 flex md:block justify-between'>
          {selectList.map((select, index) =>
            <Link key={uuidv4()} to={select.path ? select.path : ""}>
              <div onClick={() => onSelectFeature(index, select.method)} className='w-[95%] md:mx-auto h-11 mx-auto flex px-2 items-center mt-0 md:mt-4 gap-3 py-6 rounded-xl hover:cursor-pointer hover:bg-[#fafafa] transition-all'>
                {index === SelectedIndex ? select.active : select.logo}
                <h2 className={index === SelectedIndex ? 'text-md font-medium hidden xl:block 2xl:block' : 'text-md font-light hidden xl:block 2xl:block'} >{select.name}</h2>
                {select.name === "Messages" && newMessageInfo.length ? <BsDot className='text-3xl text-red-500 hidden xl:block' /> : undefined}
                {select.name === "Notifications" && isNewNotifiaction ? <BsDot className='text-3xl text-red-500 hidden xl:block' /> : undefined}
              </div>
            </Link>
          )}

        </div>
        <Menu as="div" className="h-11 mx-auto xl:w-[90%] hidden right-0 w-full lg:mx-auto absolute bottom-3 md:flex  items-center py-6 px-2 rounded-xl hover:cursor-pointer hover:bg-[#fafafa] transition-all">
          <Menu.Button className={"flex gap-x-3 items-center w-full"}>
            <AiOutlineMenu className='text-3xl m-auto xl:m-0' />
            <h2 className='text-md font-light hidden xl:block 2xl:block'>More</h2>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >

            <Menu.Items className="absolute flex flex-col gap-1 py-2 xl:right-0 lg:left-3 w-[20vw] bottom-14 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className=''>
                <Menu.Item>
                  <div className='h-9 py-5 w-full flex items-center justify-between px-3 rounded-md hover:cursor-pointer hover:bg-[#fafafa]'>
                    <h3 className='font-normal'>Settings</h3>
                    <AiOutlineSetting className='text-xl' />
                  </div>
                </Menu.Item>

                <Menu.Item>
                  <div className='h-9 w-full py-5 flex items-center justify-between px-3 rounded-md hover:cursor-pointer hover:bg-[#fafafa]'>
                    <h3 className='font-normal'>Switch appearance</h3>
                    <BsMoon className='text-xl' />
                  </div>
                </Menu.Item>
              </div>

              <div className=''>
                <Menu.Item>
                  <div className='h-9 w-full py-5 flex items-center justify-between px-3 rounded-md hover:cursor-pointer hover:bg-[#fafafa]'>
                    <h3 className='font-normal'>Log out</h3>
                  </div>
                </Menu.Item>
              </div>
            </Menu.Items>

          </Transition>
        </Menu>
        {search ? <SearchContainer search={search} onClickSearch={onClickSearch} /> : undefined}
        {notification ? <Notification onClickNotification={onClickNotification} notifications={notificationList} /> : undefined}
      </div>
    </>

  )
}

export default SideBar