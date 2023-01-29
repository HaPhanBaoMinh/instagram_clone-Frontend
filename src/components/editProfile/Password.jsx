import React, { useContext, useRef, useState } from 'react'
import AuthContext from '../../context/AuthProvider';
import srcLogo from "../../images/images.jfif"
import { toast } from 'react-toastify';
import instanceAxios from '../../api/axiosConfig';
import ROUTER from '../../api/router';
import Loading from '../loading/Loading';

function Password() {
    const [isChangeProfile, setIsChangeProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const oldPass = useRef();
    const newPass = useRef();
    const confirmPass = useRef();
    const { Auth, setAuth } = useContext(AuthContext);

    const onChangeInput = () => {
        setIsChangeProfile(true);
    }

    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const onUpdatePassword = async (oldPass, newPass, confirmPass) => {
        setIsLoading(true);
        if (newPass !== confirmPass) {
            setIsLoading(false);
            return toast.error("New password not match with confirm password!", toastOption);
        }

        const data = {
            oldPass,
            newPass,
            _id: Auth._id
        }

        try {
            const result = await instanceAxios.post("/user/password", data);
            if (result.data.status) {
                setIsLoading(false);
                setAuth(auth => ({
                    ...auth,
                    password: result.data.newPassword

                }))
                localStorage.setItem("password", result.data.newPassword);
                return toast.success("Updated password!", toastOption);
            }

            setIsLoading(false);
            return toast.error(result.data.message, toastOption);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    if (!Auth) return (
        <div className='w-[500px]  h-[500px] m-auto'>
            <Loading />
        </div>
    )

    return (
        <div className='w-[70%] h-full flex-col gap-2 py-5 flex items-center px-20 border-l-[1px] border-gray-300'>
            <div className='flex w-full gap-6 items h-fit items-center '>
                <div className={`md:w-[50px] md:h-[50px] w-[50px] h-[50px] border-red-400 border-[2px] p-[2px] cursor-pointer rounded-full flex justify-center items-center`}>
                    <img loading="lazy" src={`${ROUTER}/image/${Auth.avatar}`} alt="" className='w-full h-full object-cover rounded-full' />
                </div>
                <div className=''>
                    <p className='text-sm'> {Auth.username} </p>
                </div>

            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='name' className='font-medium text-sm w-[25%]'>Old password</label>
                <input onChange={onChangeInput} ref={oldPass} type="password" id='name' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='name' className='font-medium text-sm w-[25%]'>New password</label>
                <input onChange={onChangeInput} ref={newPass} type="password" id='name' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-center mt-3 gap-6 items h-fit items-center'>
                <label htmlFor='name' className='font-medium text-sm w-[25%]'>Confirm new password</label>
                <input onChange={onChangeInput} ref={confirmPass} type="password" id='name' className='h-[40px] w-[85%] outline-none rounded-md px-2 text-sm border-[1px] bg-gray-100' />
            </div>

            <div className='flex w-full justify-end mt-3 gap-6 items h-fit items-center'>
                {isChangeProfile ?
                    <button onClick={() => onUpdatePassword(oldPass.current.value, newPass.current.value, confirmPass.current.value)} className='w-fit h-fit bg-blue-400 text-white px-3 py-1 text-sm font-medium rounded-lg'>
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

        </div>
    )
}

export default Password