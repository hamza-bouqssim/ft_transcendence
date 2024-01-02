import { AppDispatch } from '@/app/store';
import { socketContext } from '../../utils/context/socketContext';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersThunk } from '@/app/store/usersSlice';
import { User } from '@/app/utils/types';
import { IngameStyling, OflineStyling, OnlineStyling } from '@/app/utils/styles';

export const InfoChat = () => {

  const { updateChannel,channel} = useContext(socketContext);
  const {Userdata} = useContext(socketContext);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const { users, Userstatus, Usererror } = useSelector(
		(state: any) => state.users,
	);

  useEffect(() => {
		dispatch(fetchUsersThunk());
	}, [dispatch]);



  const fetchDataUser = () =>{
    let user : User | undefined;
    if(pathname.includes("chat"))
    {
      if(channel?.recipientId === Userdata?.id){
        user = channel?.sender;
      }else
        user = channel?.recipient;
    }
      return user;
  }
  const checkTheStatus = () =>{
		let test: User | undefined;

		if (channel?.recipient.id === Userdata?.id) {
			test = channel?.sender;
		} else 
			test = channel?.recipient;
		const user = users.find((user: User) => user.id === test?.id);
		if(user)
			return user && user?.status;
		else
			return ""
	}
  const getDisplayUser = () => {
    let friend : User | undefined;
    let truncatedDisplayName
    if(pathname.includes("chat"))
    {
      if(channel?.recipientId === Userdata?.id){
        friend = channel?.sender;
      }else
        friend = channel?.recipient;
    }
    if(friend){
       truncatedDisplayName =
      friend.display_name.length > 10
        ? `${friend.display_name.substring(0, 10)}...`
        : friend.display_name;

    return {
      ...friend,
      display_name: truncatedDisplayName,
    };

    }
    
  };

  return (
    <div className='relative bg-[#CDCEDB] w-full h-full flex flex-col gap-4 px-5 py-10 rounded-t-2xl mt-[100px] mb-auto'>
      <div className='flex -mt-[80px]'>
        <Image
              src={fetchDataUser()?.avatar_url as string}
              className=" h-20 w-20 rounded-[50%] bg-black border-2 border-[--blue-color]"
              alt=""
              width={70}
              height={70}
              // placeholder='blur'
              // blurDataURL={fetchDataUser()?.avatar_url as string}
            />
            <div className='-top-[37px] '>
              {checkTheStatus() === 'online' ? (<OnlineStyling/>) :  checkTheStatus() === 'ingame' ? (<IngameStyling/>) : checkTheStatus() === 'offline' ? ( <OflineStyling/>) : <></>}
            </div>
      </div>
            
            <div className='w-full h-[30%]  flex flex-col gap-1'>
              <div className='w-full bg-[#F2F3FD] grow px-2 py-1 text-gray-600'>
                <h2 className='font-bold font-500'> {getDisplayUser()?.display_name}</h2>
                <span> {getDisplayUser()?.username}</span>
              </div>
              <div className="w-full bg-[#F2F3FD] grow px-2 py-1 text-gray-600 font-['Whitney_Semibold']">
                  <h2>Joined Pong Since</h2>
                  <span>
                      Date: {new Date(fetchDataUser()?.createdAt ?? new Date()).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          
                      })}
                  </span>
              </div>
              <div className="w-full  bg-[#F2F3FD] grow px-2 py-1 text-gray-600 font-['Whitney_Semibold'] ">
                <h2>Note</h2>
                <input className='px-2 py-1'/>
              </div>
            </div>
          

        </div>
  )
}

