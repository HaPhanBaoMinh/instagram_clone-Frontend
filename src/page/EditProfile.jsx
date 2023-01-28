import React, { useState } from 'react'
import Password from '../components/editProfile/Password'
import ProfileInfo from '../components/editProfile/ProfileInfo'

function EditProfile() {
    const [selected, setSelected] = useState("profile");

    const onChangeSelect = (tab) => {
        setSelected(tab)
    }


    return (
        <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] w-full float-right h-full flex justify-center items-center bg-[#fafafafa]'>
            <div className='w-[70%] h-[90%] border-[1px] border-gray-300 flex'>
                {/* Side bar */}
                <div className='w-[30%] h-full'>
                    <button onClick={() => onChangeSelect('profile')} className={selected === 'profile' ? "w-full border-l-2 border-black bg-white px-8 font-medium py-3 text-left transition-all hover:bg-gray-100" : "w-full bg-white px-8 py-3 text-left transition-all hover:bg-gray-100 hover:border-l-2 hover:border-gray-300"}>
                        Edit profile
                    </button>

                    <button onClick={() => onChangeSelect('password')} className={selected === 'password' ? "w-full border-l-2 border-black bg-white px-8 font-medium py-3 text-left transition-all hover:bg-gray-100" : "w-full bg-white px-8 py-3 text-left transition-all hover:bg-gray-100 hover:border-l-2 hover:border-gray-300"}>
                        Change password
                    </button>

                </div>

                {/* Input */}
                {selected === "profile" ? <ProfileInfo /> : undefined}
                {selected === "password" ? <Password /> : undefined}
            </div>
        </div>
    )
}

export default EditProfile