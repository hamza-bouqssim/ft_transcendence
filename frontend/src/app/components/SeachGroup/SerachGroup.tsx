"use client"
import {  socketContext } from '@/app/utils/context/socketContext'
import React, {useState,useEffect, useContext} from 'react'
import Image from 'next/image';
import { ConversationTypes } from '@/app/utils/types';
import {  useSelector } from "react-redux";
import { ListSearch } from './ListSearch';

export const SerachGroup = () => {
  const [groupName, setgroupName] = useState<string>("")
  const [room, setRoom] = useState<ConversationTypes[] | null >(null)
  const {socket} = useContext(socketContext)
  const { rooms} = useSelector((state:any) => state.room);

  useEffect(() => {
    socket.on("resualtRoom", (payload) => {
      setRoom(payload.resualt)
    });
    return () => {
      socket.off("resualtRoom");
    };
  }, [socket]); 

  const handleChange = (val:string) => {
    setgroupName(val)
    socket.emit("searchRoom", val);
    if(!val.length)
      setRoom(null)
    
  };
  return (
    <div>
        <input  value={groupName}
                onChange={(e) => handleChange(e.target.value)} 
                className="rounded-full  w-full my-5 text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" 
                placeholder="Group Name">
        </input>
        <div>
        {room ? (
            room.length > 0 ? (
              room.map((data: ConversationTypes) => (
                <ListSearch key={data.id} data={data}></ListSearch>
              ))
            ) : (
              <p className='text-[14px] mt-3 text-center text-gray-400 "'>No room with this name: {groupName}</p>
            )
          ) : (
            <p className='text-[14px] mt-3 text-center text-gray-400 "'>Enter the name of the room</p>
        )} 

        </div>
    </div>
  )
}
