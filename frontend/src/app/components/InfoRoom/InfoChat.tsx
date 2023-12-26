import { socketContext } from '@/app/utils/context/socketContext';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react'

export const InfoChat = () => {

  const { updateChannel,channel} = useContext(socketContext);
  const {Userdata} = useContext(socketContext);
  const pathname = usePathname()



  const fetchDataUser = () =>{
    let user;
    if(pathname.includes("chat"))
    {
      if(channel?.recipient.display_name === Userdata?.display_name){
        user = channel?.sender;
      }else
        user = channel?.recipient;
    }
      return user;
  }


  return (
 
										<div className=" flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[20px] p-5 ">
											
											<Image
												src={fetchDataUser()?.avatar_url as string}
												className="h-auto w-auto rounded-full"
												alt=""
												width={120}
												height={120}
												priority={true}
											/>
                      <span className="text-[25px] text-[--purple-color]">
                      {fetchDataUser()?.display_name}
												</span>
                        <span className="text-[25px] text-[--purple-color]">
                        @{fetchDataUser()?.username}
												</span>
                        {/* <h2 className="text-[20px] text-gray-800">
												  Member PingPong depuis{" "}
												  <span className="text-[25px] text-[--purple-color]">
                            {fetchDataUser()?.display_name}
												  </span>
											  </h2> */}
										
										</div>
  )
}
