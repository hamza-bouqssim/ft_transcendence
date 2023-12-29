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

  return (
    <div className='relative bg-[#CDCEDB] w-full h-[80%] flex flex-col gap-4 px-5 py-10 rounded-t-2xl'>
      <div className='flex'>
        <Image
              src={fetchDataUser()?.avatar_url as string}
              className=" -top-[37px] left-[18px] w-[70px] rounded-full"
              alt=""
              width={120}
              height={120}
              priority={true}
            />
            <div className='-top-[37px] '>
              {checkTheStatus() === 'online' ? (<OnlineStyling/>) :  checkTheStatus() === 'offline' ? (<OflineStyling/>) :( <IngameStyling/>)}

            </div>
      </div>
            


            <div className='w-full h-[30%]  flex flex-col gap-1'>
              <div className='w-full bg-[#F2F3FD] grow px-2 py-1 text-gray-600'>
                <h2 className='font-bold font-500'> {fetchDataUser()?.display_name}</h2>
                <span> {fetchDataUser()?.username}</span>
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
            {/* <div className= "w-full h-[10%] bg-[#F2F3FD] px-2 py-2 text-gray-600  font-['Whitney_Semibold']">
              <h1>Channels participate</h1>
              <span>{fetchDataUser()?.createdAt}</span>
              
              </div>
										 */}

        </div>
  )
}