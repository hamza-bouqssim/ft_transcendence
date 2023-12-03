"use client";
import { IoMdAdd } from "react-icons/io";
import {useRouter,usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import {useEffect,useContext} from 'react'
import {getAllRooms} from '@/app/store/roomsSlice'
import {socketContext } from "@/app/utils/context/socketContext";

  interface Room {
    id: string;
    name: string;
    Privacy: string;
    password?:string;
    picture: string;
    createdAt: string;
    updatedAt: string;
    members: {
      isAdmin: boolean;
    };
    lastMessage?:string;
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
      dispatch(getAllRooms());
    }, [dispatch]);
  
    if (status =="loading"|| status =="idle") {
      return(
        <div className="flex items-center justify-center mt-40">
        <div
              class=" text-[#5B8CD3]   h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span
                class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div></div>)
    }
    
    if (status === 'failed') {
      return <div className="text-black ">Error: {error}</div>;
    }
    
  
    return (
      <div className="text-black  pb-2 pt-5 h-[calc(100%-160px)] overflow-auto  no-scrollbar">
        {[...rooms].sort(compareRooms)?.map((data: Room) => (
          <div key={data.id} onClick={() =>{updateChannel(data)}}  className="cursor-pointer rounded-lg hover:bg-[#F2F3FD] flex items-center justify-between px-2 py-3">
            <div className="flex items-center justify-start">
                <img className="w-16 h-16  bg-cover rounded-full" src={data.picture} alt="" />
                <div className="ml-4">
                <h1>{data.name}</h1>
                {data.lastMessage ? <h1 className="text-[12px] text-gray-400 ">{data.lastMessage}</h1>:<h1 className="text-[12px] text-gray-400 ">new room</h1>}
                </div>
            </div>
            {data.updatedAt ?<div className="text-[12px] text-gray-400 ">{formatCustomDate(new Date(),new Date(data.updatedAt))}</div>
            :<div className="text-[12px] text-gray-400 ">{formatCustomDate(new Date(),new Date(data.createdAt))}</div> }

          </div>
        ))}
        <div className="md:h-16 h-28">

		lastDate: "2023-11-08",
	},
	{
		id: "7",
		name: "David",
		lastMessage: "What's up?",
		image:
			"https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL

export default GroupsManagement;
