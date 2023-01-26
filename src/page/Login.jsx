import React, { useContext, useRef, useState } from 'react'
import srcImg from "../images/screenshot4.png"
import srcLogo from "../images/Instagram_logo.svg.png"
import { AiFillFacebook } from "react-icons/ai";
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider';
import instanceAxios from '../api/axios';
import { toast } from 'react-toastify';

function Login() {
  const phoneOrEmail = useRef();
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

  const onLogin = async () => {
    let Error = {};
    let isValidInfo = true;

    // Check valid
    if (phoneOrEmail.current.value.length < 3) {
      Error.phoneOrEmail = "Phone or Email must contain more than 3 characters";
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
      const data = {
        payload: phoneOrEmail.current.value,
        password: password.current.value
      }
      const result = await instanceAxios.post("/user/login", data);
      if (result.data.status === false) {
        toast.error(result.data.message, toastOption);
        return;
      }

      if (result.data.status === true) {
        const { accessToken, timeExpired, refreshToken } = await result.data.token;

        localStorage.setItem('token', JSON.stringify({ accessToken, timeExpired }));
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
        localStorage.setItem("payload", phoneOrEmail.current.value);
        localStorage.setItem("password", password.current.value);
      }
      setAuth({ ...result.data.result, ...result.data.token });
      setSignUpSuccess(true);
    } catch (error) {

    }
  }

  if (SignUpSuccess) {
    return <Navigate to="/home" />
  }

  return (
    <div className='lg:max-w-[60%]  h-full m-auto grid grid-cols-1 2xl:grid-cols-2 '>
      <div className=' bg-white py-5 hidden 2xl:flex'>
        <div className='bg-[url("https://static.cdninstagram.com/rsrc.php/v3/y4/r/ItTndlZM2n2.png")] hidden 2xl:block relative w-full bg-contain bg-no-repeat bg bg-center'>
          <img loading="lazy" src={srcImg} alt="" className='absolute top-11 right-[57px]' />
        </div>
      </div>
      <div className='py-5 max-w-md mx-auto'>
        <div className='bg-white w-full h-full mt-5'>
          <div className='w-[90%] mx-auto h-fit bg-white border py-3 '>
            <img loading="lazy" src={srcLogo} alt="" className='w-2/4 mx-auto my-5' />

            <input ref={phoneOrEmail} type="text" className='px-2 block appearance-none border rounded-sm text-sm outline-none w-5/6 h-8 py-5 bg-[#fafafa] m-auto pl-2' placeholder='Phone number, username or email' />
            {Error.phoneOrEmail ? <span className='text-[12px] w-5/6 m-auto block text-red-400'>{Error.phoneOrEmail}</span> : undefined}
            <input ref={password} type="password" className='px-2 block appearance-none rounded-sm border text-sm outline-none w-5/6 h-8 py-5 bg-[#fafafa] m-auto pl-2 mt-2' placeholder='Password' />
            {Error.password ? <span className='text-[12px] w-5/6 m-auto block text-red-400'>{Error.password}</span> : undefined}

            <button onClick={onLogin} className='w-5/6 block transition-all hover:bg-[#1c8edb] text-white py-2 mt-5 rounded-md m-auto bg-[#4db5f9] font-semibold'>Login</button>
            <div className='w-5/6  mt-5 m-auto flex items-center justify-between'>
              <span className='w-2/5 block border-t border-[#aaaaaa]'></span>
              <h3 className='font-semibold text-[#aaaaaa]'>OR</h3>
              <span className='w-2/5 block border-t border-[#aaaaaa]'></span>
            </div>
            <h3 className='flex w-5/6 m-auto justify-center mt-5 gap-x-2 items-center font-semibold text-blue-500 hover:text-blue-600 hover:cursor-pointer transition-all'>
              <AiFillFacebook className='text-xl' />
              Log in with facebook
            </h3>
            <h4 className='text-center mt-4 font-thin hover:cursor-pointer text-sm'>Forgot password?</h4>
          </div>

          <div className='w-[90%] mx-auto h-1/6 mt-5 bg-white border flex justify-center items-center'>
            <h3 className='font-semibold'>Don't have an account?
              <Link to='/signup'>
                <span className='text-blue-600 hover:cursor-pointer transition-all hover:text-blue-700'> Sign up</span>
              </Link>
            </h3>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login