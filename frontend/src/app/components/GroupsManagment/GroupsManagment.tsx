"use client" 
import { IoMdAdd } from "react-icons/io";
import {useRouter,usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import {useEffect,useContext} from 'react'
import {getAllRooms} from '@/app/store/roomsSlice'
import {socketContext } from "@/app/utils/context/socketContext";
import Image from "next/image";

interface Member {
  user_id: string;
  isAdmin: boolean;
}

interface Room {
  id: string;
  name: string;
  Privacy: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
}

  function compareRooms(a: Room, b: Room): number {
    if (a.lastMessage && b.lastMessage) {
      return a.lastMessage.localeCompare(b.lastMessage);
    } else if (a.lastMessage) {
      return -1; 
    } else if (b.lastMessage) {
      return 1;
    }
  
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }
  
  function formatCustomDate(startDate: Date, endDate: Date): string {
    const diffInHours = Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (diffInHours >24) {
      const dayOfWeek = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(endDate);
      const dayOfMonth = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(endDate);
  
      return `${dayOfWeek} ${dayOfMonth}`;
    } else {
      const hours = endDate.getHours();
      const minutes = endDate.getMinutes().toString().padStart(2, '0');
  
      return `${hours}:${minutes}`;
    }
  }
  const GroupsManagement = () => {
    const router = useRouter();
	  const pathname = usePathname()
    const dispatch = useDispatch();

    const { rooms, status, error } = useSelector((state:any) => state.room);
    const {updateChannel, channel } = useContext(socketContext);
    useEffect(() => {
      dispatch(getAllRooms())
    }, [dispatch]);
    console.log("hi")
    if (status.get =="loading" || status.get =="idle") {
      console.log("loading")
      return(
        <div className="flex items-center justify-center mt-40">
        <div
              className=" text-[#5B8CD3]   h-8 w-8 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div></div>)
    }
    
    if (status.get === 'failed') {
      return <div className="text-gray-500 mt-10 text-center ">{error} </div>;
    }

    return (
      <div className="text-black  pb-2 pt-5 h-[calc(100%-74px)] overflow-auto  no-scrollbar">
        {rooms && [...rooms].sort(compareRooms)?.map((data: Room) => (
          <div key={data.id} onClick={() =>{updateChannel(data) ; }}  className="cursor-pointer rounded-[10px] hover:bg-[#F2F3FD] flex items-center justify-between px-2 py-3">
            <div className="flex items-center justify-start">
                <Image className="w-16 h-16  bg-cover rounded-full" src={data.picture} alt="" height={30} width={30}/>
                <div className="ml-4">
                <h1>{data.name}</h1>
                {data.lastMessage ? <h1 className="text-[12px] text-gray-400 ">{data.lastMessage}</h1>:<h1 className="text-[12px] text-gray-400 ">new room</h1>}
                </div>
            </div>
            {data.updatedAt ?<div className="text-[12px] text-gray-400 ">{formatCustomDate(new Date(),new Date(data.updatedAt))}</div>
            :<div className="text-[12px] text-gray-400 ">{formatCustomDate(new Date(),new Date(data.createdAt))}</div> }

          </div>
        ))}
        <div className="md:h-32 h-32">

        </div>
      </div>
    );
  };
  

export default GroupsManagement;