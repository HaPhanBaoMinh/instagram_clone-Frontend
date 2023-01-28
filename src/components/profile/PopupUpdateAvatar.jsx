import React, { useContext, useRef } from 'react'
import instanceAxios from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const PopupUpdateAvatar = ({ onClose, updateAvatar }) => {
    const formData = useRef(new FormData());
    const { Auth, setAuth } = useContext(AuthContext);

    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const onSelectAvatar = async (file) => {
        if (!file) return;
        if (!Auth) return;
        formData.current.append('image', file);
        formData.current.append('user_id', Auth._id);
        try {
            const result = await instanceAxios.post("/user/avatar", formData.current);
            if (result.data.status) {
                formData.current.delete("image");
                formData.current.delete("user_id");
                onClose();
                updateAvatar(result.data.newAvatar);
                toast.success("Updated avatar", toastOption)
            }
        } catch (error) {
            toast.error(error.message, toastOption)

        }

    }

    return (
        <div className='xl:w-[100%] xl:pl-0 md:w-full md:pl-[75px] z-[60] top-0 right-0 w-full h-full  bg-[#59595968] fixed'>
            <div className='w-full h-full p-3 flex justify-center items-center' >
                <div className='container flex flex-col box-content animate-waving-hand overflow-hidden bg-white xl:w-[25%] lg:w-[90%] w-[90%] rounded-xl '>
                    <h4 className='w-full py-4 text-center text-md font-medium border-b-2'>
                        Update avatar
                    </h4>

                    <label className='w-full py-4 text-center cursor-pointer text-md font-medium text-blue-500 hover:bg-gray-100 transition-all'>
                        Select avatar
                        <input type="file" className='hidden' onChange={(e) => onSelectAvatar(e.target.files[0])} />
                    </label>

                    <button onClick={onClose} className='w-full py-4 text-center text-md font-medium cursor-pointer text-red-500 hover:bg-gray-100 transition-all'>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PopupUpdateAvatar