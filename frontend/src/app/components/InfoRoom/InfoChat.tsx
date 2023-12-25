import { socketContext } from '@/app/utils/context/socketContext';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react'

export const InfoChat = () => {

  const { updateChannel,channel} = useContext(socketContext);
  const {Userdata} = useContext(socketContext);
  const pathname = usePathname()



  // const fetchDataUser = () =>{
  //   let user;
  //   if(pathname.includes("chat"))
  //   {
  //     if(channel?.recipient.display_name === Userdata?.display_name){
  //       user = channel?.sender;
  //     }else
  //       user = channel?.recipient;
  //   }
   

  //     return user;
  // }


  return (
    <div>
          <div>
            {/* <Image src={fetchDataUser()?.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} /> */}
          </div>
          {/* <div className='text-black'>{fetchDataUser()?.display_name}</div> */}


    </div>
  )
}
