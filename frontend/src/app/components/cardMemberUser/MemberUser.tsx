"use client"
import { AppDispatch } from '@/app/store';
import {  fetchGetAllFriendsThunk } from '@/app/store/friendsSlice';
import { FriendsTypes, UsersTypes } from '@/app/utils/types';
import Image from 'next/image';
import React  , {useEffect,useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'


interface Friend {
    id: number;
    username: string;
    image: string;
    displayname: string;
}


interface MemberUserProps {
  idUserAdd: string[]; // Assuming idUserAdd is of type string, adjust as needed
  setIdUserAdd: React.Dispatch<React.SetStateAction<string[]>>; // Adjust the type based on your use case
}

export const MemberUser: React.FC<MemberUserProps> = ({ idUserAdd, setIdUserAdd }) => {  
  const { friends, status, error } = useSelector((state:any) => state.friends);
  const dispatch = useDispatch<AppDispatch>();
  console.log("hi")
  useEffect(() => {
    
    dispatch(fetchGetAllFriendsThunk());
  }, [dispatch]);
    const handleAddUser = (userId: string) => {
      setIdUserAdd((prevIds:any) => [...prevIds, userId]);
    };
    const handleRemoveUser = (userId: string) => {
      const updatedUsers = idUserAdd.filter((id:string) => id !== userId);
      setIdUserAdd(updatedUsers);
    };
    return (
      <> 
        <div className="flex items-center justify-center">
                  <input className="rounded-full mb-1 w-full text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Search Friend"></input>
        </div>
        <div className=" no-scrollbar ">
          {friends?.map((user : FriendsTypes) => (
            <div key={user.id} className="flex items-center justify-between my-2">
              <div className="flex items-center justify-center ">
                <div className="relative">
                  <Image className="w-14 rounded-full" src={user.avatar_url} alt={user.display_name} height={30} width={30}/>
                  {
                    user.status === "offline" 
                    ? <div className="w-3 h-3 bg-red-400   absolute bottom-1 right-0 rounded-full"></div> 
                    : <div className="w-3 h-3 bg-green-600 absolute bottom-1 right-0 rounded-full"></div> 
                  }
                </div>
                <div className="ml-2 ">
                  <h2>{user.username}</h2>
                  <h2 className="text-[13px] text-slate-400">{user.username}</h2>
                </div>
              </div>
              {idUserAdd.includes(user.id) ? <button onClick={() => handleRemoveUser(user.id)} className="bg-[#EA7F87] text-white text-[14px] p-2 rounded-[5px]" >remove user</button>
                :
                <button onClick={() =>handleAddUser(user.id) } className="bg-[#5B8CD3] text-white text-[14px] p-2 rounded-[5px]" >Add user</button>
              }
            </div>
          ))}
        </div>
      
      </>
    );
  };
