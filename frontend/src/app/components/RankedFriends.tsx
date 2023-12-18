import Image from 'next/image'
import React from 'react'

interface RankedFriendsProps {
  rank: number;
  picture: string;
  username: string;
}

const RankedFriends: React.FC<RankedFriendsProps> = ({ rank, picture, username }) => {
  return (
    
            <div className='flex  justify-between py-[2px] bg-gray-100  w-[98%] mt-[5px]  h-[40px] rounded-[40px] hover:bg-gray-200'>

              <div className='flex h-full w-[29%] mx-[5px]  items-center justify-start gap-2'>
                <h1>{rank}</h1>
                <Image src={picture} alt=""  className='rounded-full h-[30px] w-[30px]' height={30} width={30}/>
              </div>

              <div className='flex h-full w-[69%] items-center justify-between'>
                <h1>@{username}</h1>

              </div>
            </div>
  )
}

export default RankedFriends