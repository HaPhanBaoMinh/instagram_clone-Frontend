import React, { useState } from 'react'
import CreatePost from '../createPost/CreatePost'
import SideBar from './SideBar'

function DefaultLayout({ children }) {
  const [onCreate, setonCreate] = useState(false);

  const onClickCreate = () => {
    setonCreate(preValue => !preValue);
  }

  return (
    <div className='w-full h-full'>
      <SideBar onClickCreate={onClickCreate} />
      {onCreate ? <CreatePost onClickCreate={onClickCreate} /> : undefined}
      {children}

      {/* Feature */}
    </div>
  )
}

export default DefaultLayout