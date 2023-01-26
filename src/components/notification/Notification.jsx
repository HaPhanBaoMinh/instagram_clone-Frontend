import React, { useContext, useEffect } from 'react'
import instanceAxios from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import SocketContext from '../../context/SocketProvider';
import srcLogo from "../../images/308_4122.jpg"
import NotificationItem from './NotificationItem';

function Notification({ notifications, onClickNotification }) {
    const { Auth } = useContext(AuthContext);

    const seenNotification = async (user_id) => {
        if (!user_id) return;
        const result = await instanceAxios.get(`/notification/seen/${user_id}`);
        return result
    }
    useEffect(() => {
        if (Auth) {
            seenNotification(Auth._id);
        }
    }, [Auth])


    if (!notifications) {
        return <div>Loading...</div>
    }

    return (
        <div className='w-[400px] overflow-hidden border rounded-tr-2xl rounded-br-2xl h-full bg-white absolute top-0 xl:left-[100%] md:left-[75px] shadow-[20px_-1px_20px_-20px_rgb(0,0,0,0.25);]	'>
            <h1 className='text-2xl p-3 font-semibold'>Notifications</h1>
            {
                notifications.map(notification => <NotificationItem type={notification.type} onClick={onClickNotification} key={notification._id} user={notification.action_userInfo} post={notification.postInfo} />)
            }

            {/* <div className='w-full px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all'>
                <img loading="lazy" src={srcLogo} alt="" className='w-[40px] h-[40px] object-cover rounded-full' />
                <p className='text-sm w-[70%]'>baominh.129 started following you</p>
            </div> */}
        </div>
    )
}

export default Notification