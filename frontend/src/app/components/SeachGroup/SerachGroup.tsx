"use client"
import { socket, socketContext } from '@/app/utils/context/socketContext'
import React, {useState,useEffect, useContext} from 'react'
import Image from 'next/image';
import { ConversationTypes } from '@/app/utils/types';
import { useDispatch, useSelector } from "react-redux";

export const SerachGroup = () => {
  const [groupName, setgroupName] = useState<string>("")
  const [room, setRoom] = useState<ConversationTypes[] | null >(null)
  const {socket} = useContext(socketContext)
  const { rooms} = useSelector((state:any) => state.room);

  const {updateChannel,channel} =useContext(socketContext)
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
  console.log(room)
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
                <div key={data.id} className="flex text-black items-center justify-between my-4">
                <div className="flex items-center justify-center ">
                  <div className="relative">
                    <Image className="w-14 rounded-full" src={data.picture} alt={data.name} height={30} width={30}/>
                  </div>
                  <div className="ml-2 ">
                    <h2>{data.name}</h2>
                    <h2 className="text-[13px] text-slate-400">{data.Privacy}, {data.members.length} Members</h2>
                  </div>
                </div>
                
                    <button onClick={()=>{updateChannel(data)}}  className="bg-[#5B8CD3] text-white text-[14px] p-2 rounded-full" >Join Room</button>
             
              </div>
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
