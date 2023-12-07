"use client"
import React ,{useContext} from 'react'
import {MdEdit} from 'react-icons/md'
import { socketContext } from '@/app/utils/context/socketContext'
export const InfoGroups = () => {
  const { updateChannel,channel} = useContext(socketContext);
  return (
    <div className="p-1 relative h-full">
        <div className=" p-2 h-full overflow-auto  rounded-xl  text-black  bg-[#E0E3FF] no-scrollbar">
         

          <div className="">
            <p>Joined Pong Since</p>
            <p>2023-07-12</p>
          </div>
             

            </div> 
    </div>
  )
}
