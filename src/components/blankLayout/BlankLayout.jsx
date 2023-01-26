import React from 'react'

function BlankLayout({ children }) {
  return (
    <div className='w-full h-full' >
      {children}
    </div>
  )
}

export default BlankLayout