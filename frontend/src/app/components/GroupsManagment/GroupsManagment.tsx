"use client" 
import { IoMdAdd } from "react-icons/io";
import {useRouter,usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import {useEffect} from 'react'
import {getAllRooms} from '@/app/store/roomsSlice'
interface ConversationTypes {
    id: string;
    name: string;
    lastMessage: string;
    image: string;
    lastDate: string;
  }
  
  const GroupsManagement = () => {
    const router = useRouter();
	  const pathname = usePathname()
    const dispatch = useDispatch();
    const { rooms, status, error } = useSelector((state:any) => state.room);
  
    useEffect(() => {
      dispatch(getAllRooms());
    }, [dispatch]);
  
    if (status === 'loading') {
      return <div>Loading...</div>;
    }
  
    if (status === 'failed') {
      return <div>Error: {error}</div>;
    }
    console.log("room",rooms)
    return (
      <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
        {rooms.data?.map((data: ConversationTypes) => (
          <div key={data.id} onClick={() =>{router.push("/dashboard/groups/"+data.id)}}  className="cursor-pointer rounded-lg hover:bg-[#F2F3FD] flex items-start justify-between px-2 py-3">
            <div className="flex items-center justify-start">
                <img className="w-16 h-16  bg-cover rounded-full" src={data.picture} alt="" />
                <div className="ml-4">
                <h1>{data.name}</h1>
                <h1>{data.lastMessage}</h1>
                </div>
            </div>
            <div>{data.lastDate}</div>
          </div>
        ))}
        <div className="md:h-16 h-28">

        </div>
      </div>
    );
  };
  

export default GroupsManagement;