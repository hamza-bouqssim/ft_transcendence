"use client"
import React ,{useContext} from 'react'
import {MdEdit} from 'react-icons/md'
import { socketContext } from '@/app/utils/context/socketContext'
export const InfoGroups = () => {
  const { updateChannel,channel} = useContext(socketContext);
  return (
    <div className="p-1">
         <div className="flex items-center justify-center ">
          <div className="bg-[# ] p-4 rounded-full w-auto mx-auto ">
            <img className="bg-cover mx-auto w-20 mt-20 h-20  rounded-full" src={channel.picture} alt="" srcset="" />
            <p className="text-black mx-auto  mt-5  ">{channel.name}</p>
          </div>
        </div>
        <div className="h-[500px] p-2 mt-10 rounded-xl min-h-[200px] text-black  bg-[#E0E3FF]">
          <div className="h-[20%] py-5">
            <p>Joined Pong Since</p>
            <p>2023-07-12</p>
          </div>
          <div className="overflow-auto h-[80%]">
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
              <p>sdfsdfsdfds</p>
          </div>
            </div> 
    </div>
  )
}
