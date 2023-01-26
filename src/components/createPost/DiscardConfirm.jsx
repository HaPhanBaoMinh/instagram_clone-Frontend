import React from 'react'

function DiscardConfirm({ onConfirmDisCard, onCancelDiscard }) {
    return (
        <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] right-0 w-screen h-screen fixed top-0 bg-[#59595990] flex justify-center items-center z-50'>
            <div className='w-[260px] animate-waving-hand h-fit bg-white rounded-xl lg:w-[400px] lg:h-[200px]'>
                <div className='w-full flex justify-center items-center flex-col text-center py-5 px-5 border-b-[1px]'>
                    <h2 className='text-xl font-medium'>Discard post?</h2>
                    <p className='text-sm mt-1 text-[#9c8e8e]'>If you leave, your edits won't be saved.</p>
                </div>
                <button onClick={() => {
                    onConfirmDisCard();
                    onCancelDiscard();
                }} className='w-full py-3 border-b-[1px] font-medium text-red-500 active:bg-[#0000001a]'>
                    Discard
                </button>
                <button onClick={onCancelDiscard} className='w-full py-3 active:bg-[#0000001a]'>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default DiscardConfirm