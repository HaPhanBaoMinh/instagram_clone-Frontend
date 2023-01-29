import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import instanceAxios from '../../api/axiosConfig';
import ROUTER from '../../api/router';
import AuthContext from '../../context/AuthProvider';
import srcLogo from "../../images/images.jfif"
import Loading from '../loading/Loading';
import PopupUpdateAvatar from '../profile/PopupUpdateAvatar';

function ProfileInfo() {
    const { Auth, setAuth } = useContext(AuthContext);
    const [onUpdateAvatar, setOnUpdateAvatar] = useState(false);
    const [isChangeProfile, setIsChangeProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const newName = useRef();
    const newUserName = useRef();
    const newEmail = useRef();
    const newPhone = useRef();
    const newBio = useRef();

    const onSelectUpdateAvatar = () => {
        setOnUpdateAvatar(!onUpdateAvatar);
    }

    const updateAvatar = (newAvatar) => {
        setAuth(auth => (
            {
                ...auth,
                avatar: newAvatar
            }
        ))
    }

    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const onUpdateProfile = async (newName, newUserName, newEmail, newPhone, newBio) => {
        if (!newName || !newUserName || !newPhone) {
            return toast.error("Invalid new filed!", toastOption);
        }
        setIsLoading(true);
        const data = {
            newName,
            newUserName,
            newEmail,
            newPhone,
            newBio,
            _id: Auth._id
        }

        try {
            const result = await instanceAxios.post("/user/edit", data);
            if (result.data.status) {
                setAuth(auth => ({
                    ...auth,
                    name: newName,
                    username: newUserName,
                    email: newEmail,
                    phone: newPhone,
                    bio: newBio,

                }))
                setIsLoading(false);
                return toast.success("Updated profile!", toastOption);
            }

            setIsLoading(false);
            return toast.error(result.data.message, toastOption);
        } catch (error) {
            console.log(error);
        }


    }

    const onChangeInput = () => {
        setIsChangeProfile(true)
    }

    if (!Auth) return (
        <div className='w-[500px]  h-[500px] m-auto'>
            <Loading />
        </div>
    )

    return (
        <div className='w-[70%] h-full flex-col gap-2 py-5 flex items-center px-20 border-l-[1px] border-gray-300'>
            <div className='flex w-full gap-6 items h-fit items-center'>
                <div className={`md:w-[50px] md:h-[50px] w-[50px] h-[50px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    <img loading="lazy" src={`${ROUTER}/image/${Auth.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                </div>
                <div className=''>
                    <p className='text-sm'> {Auth.username} </p>
                    <button onClick={onSelectUpdateAvatar} className='text-sm font-medium text-blue-400'>
                        Change profile photo
                    </button>
                </div>

            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='name' className='font-medium text-sm w-[15%]'>Name</label>
                <input ref={newName} onChange={onChangeInput} defaultValue={Auth.name} type="text" id='name' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm  border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='username' className='font-medium text-sm w-[15%]'>Username</label>
                <input ref={newUserName} onChange={onChangeInput} defaultValue={Auth.username} type="text" id='username' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='email' className='font-medium text-sm w-[15%]'>Email</label>
                <input ref={newEmail} onChange={onChangeInput} defaultValue={Auth.email} type="email" id='email' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='phone' className='font-medium text-sm w-[15%]'>Phone</label>
                <input ref={newPhone} onChange={onChangeInput} defaultValue={Auth.phone} type="text" id='phone' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-start'>
                <label htmlFor='bio' className='font-medium text-sm w-[15%]'>Bio</label>
                <textarea ref={newBio} onChange={onChangeInput} defaultValue={Auth.bio} type="text" id='bio' cols="30" rows="3" maxLength="800" className='border-[1px] bg-gray-100 w-[85%] p-2 outline-none rounded-md px-2 text-sm whitespace-pre-line' />
            </div>

            <div className='flex w-full justify-end mt-3 gap-6 items h-fit items-center'>
                {isChangeProfile ?
                    <button onClick={() => onUpdateProfile(newName.current.value, newUserName.current.value, newEmail.current.value, newPhone.current.value, newBio.current.value)} className='w-fit h-fit bg-blue-400 text-white px-3 py-1 text-sm font-medium rounded-lg'>
                        {isLoading ?
                            <div className="h-[10%] w-[10%] rounded-full p-2 border-2 animate-spin border-t-red-400 border-t-1 ">
                            </div>
                            : "Submit"
                        }
                    </button>
                    :
                    <button className='disabled w-fit h-fit bg-gray-300 cursor-default text-white px-3 py-1 text-sm font-medium rounded-lg'>
                        Submit
                    </button>
                }
            </div>
            {onUpdateAvatar ? <PopupUpdateAvatar onClose={onSelectUpdateAvatar} updateAvatar={updateAvatar} /> : undefined}

        </div>
    )
}

export default ProfileInfo