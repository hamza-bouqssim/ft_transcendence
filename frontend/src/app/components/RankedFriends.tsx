import React from 'react'

const RankedFriends = ({rank, picture, username}) => {
  return (
    
            <div className='flex  justify-between py-[2px] bg-gray-100  w-[98%] mt-[5px]  h-[40px] rounded-[40px] hover:bg-gray-200'>

              <div className='flex h-full w-[29%] mx-[5px]  items-center justify-start gap-2'>
                <h1>{rank}</h1>
                <img src={picture} alt=""  className='rounded-full h-[30px] w-[30px]'/>
              </div>

              <div className='flex h-full w-[69%] items-center justify-between'>
                <h1>@{username}</h1>

              </div>
            </div>
  )
}

export default RankedFriends