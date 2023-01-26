import React, { useContext, useState } from 'react'
import srcLogo from "../images/Instagram_logo.svg.png"
import { AiFillFacebook } from "react-icons/ai";
import { Link, Navigate } from 'react-router-dom';
import { useRef } from 'react';
import { toast } from "react-toastify";
import axios from "axios"
import instanceAxios from "../api/axios";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from '../context/AuthProvider';

function SignUp() {
    const phoneOrEmail = useRef();
    const fullName = useRef();
    const userName = useRef();
    const password = useRef();
    const [Error, setError] = useState({});
    const { setAuth } = useContext(AuthContext);
    const [SignUpSuccess, setSignUpSuccess] = useState(false);

    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const onSignup = async () => {
        let Error = {};
        let isValidInfo = true;

        // Check valid info
        if (phoneOrEmail.current.value.length < 3 || phoneOrEmail.current.value.length > 50) {
            Error.phoneOrEmail = "Phone or Email must contain more than 3 characters";
            isValidInfo = false;
        }

        if (fullName.current.value.length === 0 || fullName.current.value.length > 20) {
            Error.fullName = "Fullname must contain 1-20 characters";
            isValidInfo = false;
        }

        if (userName.current.value.length === 0 || userName.current.value.length > 20) {
            Error.userName = "UserName must contain 1-20 characters";
            isValidInfo = false;
        }

        if (password.current.value.length < 3 || password.current.value.length > 20) {
            Error.password = "Password must contain 3-20 characters";
            isValidInfo = false;
        }

        if (!isValidInfo) {
            setError(Error);
            return;
        }

        try {
            //check phone of email;
            let phone = "";
            let email = "";
            +phoneOrEmail.current.value ? phone = phoneOrEmail.current.value : email = phoneOrEmail.current.value;
            const data = {
                phone,
                email,
                name: fullName.current.value,
                password: password.current.value,
                username: userName.current.value,
            }
            const result = await instanceAxios.post(`/user/signup`, data);
            if (result.data.status === false) {
                return toast.error(result.data.message, toastOption);
            }

            if (result.data.status === true) {
                const { accessToken, timeExpired, refreshToken } = await result.data.token;

                localStorage.setItem('token', JSON.stringify({ accessToken, timeExpired }))
                localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
            }
            setAuth({ ...result.data.insert, ...result.data.token });
            setSignUpSuccess(true);
        } catch (error) {
            console.log(error.message);
        }
    }

    if (SignUpSuccess) {
        return <Navigate to="/home" />
    }

    return (
        < div className='lg:max-w-[60%]  h-full m-auto py-5' >
            <div className='max-w-md h-fit border-zinc-300 rounded-sm border m-auto p-4 pb-6'>
                <img loading="lazy" src={srcLogo} alt="" className='w-2/4 mx-auto' />
                <h3 className='text-center font-semibold text-gray-600 text-lg'>Sign up to see photos and videos from your friends.</h3>
                <button className='w-5/6 m-auto text-center bg-blue-400 mt-3 rounded-md hover:bg-blue-500 transition-all flex justify-center items-center py-2'>
                    <h3 className='flex w-5/6 m-auto justify-center gap-x-2 items-center font-semibold text-white transition-all'>
                        <AiFillFacebook className='text-xl' />
                        Log in with facebook
                    </h3>
                </button>
                <div className='w-5/6  mt-5 m-auto flex items-center justify-between'>
                    <span className='w-2/5 block border-t border-[#aaaaaa]'></span>
                    <h3 className='font-semibold text-[#aaaaaa]'>OR</h3>
                    <span className='w-2/5 block border-t border-[#aaaaaa]'></span>
                </div>
                <div className='flex flex-col gap-y-2 mt-5'>
                    <input type="text" ref={phoneOrEmail} className='block appearance-none border rounded-sm text-sm outline-none w-5/6 h-8 py-5 px-2 bg-[#fafafa] m-auto pl-2' placeholder='Phone number or Email' />
                    {Error.phoneOrEmail ? <span className='text-[12px] w-5/6 m-auto block text-red-400'>{Error.phoneOrEmail}</span> : undefined}
                    <input type="text" ref={fullName} className='block appearance-none border rounded-sm text-sm outline-none w-5/6 h-8 py-5 px-2 bg-[#fafafa] m-auto pl-2' placeholder='Full Name' />
                    {Error.fullName ? <span className='text-[12px] w-5/6 m-auto block text-red-400'>{Error.fullName}</span> : undefined}
                    <input type="text" ref={userName} className='block appearance-none border rounded-sm text-sm outline-none w-5/6 h-8 py-5 px-2 bg-[#fafafa] m-auto pl-2' placeholder='Username' />
                    {Error.userName ? <span className='text-[12px] w-5/6 m-auto block text-red-400'>{Error.userName}</span> : undefined}
                    <input type="password" ref={password} className='block appearance-none border rounded-sm text-sm outline-none w-5/6 h-8 py-5 px-2 bg-[#fafafa] m-auto pl-2' placeholder='Password' />
                    {Error.password ? <span className='text-[12px] w-5/6 m-auto block text-red-400'>{Error.password}</span> : undefined}
                </div>
                <button onClick={onSignup} className='w-5/6 block transition-all font-semibold hover:bg-[#1c8edb] text-white py-2 mt-5 rounded-md m-auto bg-[#4db5f9]'> Sign up </button>
                <h3 className='font-semibold text-center mt-5'>Have an account?
                    <Link to='/login'>
                        <span className='text-blue-600 hover:cursor-pointer transition-all hover:text-blue-700'>  Log in</span>
                    </Link>
                </h3>
            </div>

        </div >
    )
}

export default SignUp