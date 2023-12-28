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
    let user;
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
    <div className='relative bg-red-400 w-full h-[80%]'>
            <Image
              src={fetchDataUser()?.avatar_url as string}
              className="absolute -top-[37px] left-[18px] w-[70px] rounded-full"
              alt=""
              width={120}
              height={120}
              priority={true}
            />
										{/* <div className=" bg-yellow-400 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[20px] p-5 ">
                        <div className='flex'> */}
                            {/* <Image
                              src={fetchDataUser()?.avatar_url as string}
                              className="w-[70px] rounded-full"
                              alt=""
                              width={120}
                              height={120}
                              priority={true}
                            /> */}
                            {/* {checkTheStatus() === 'online' ? (<OnlineStyling/>) :  checkTheStatus() === 'offline' ? (<OflineStyling/>) :( <IngameStyling/>)} */}
                        {/* </div> */}
											
                      {/* <span className="text-[25px] text-[--pink-color] font-['Whitney_Semibold']">
                      {fetchDataUser()?.display_name}
												</span>
                        <span className="text-[25px] text-[--pink-color] font-['Whitney_Semibold']">
                        @{fetchDataUser()?.username}
												</span> */}
                       
										
										{/* </div> */}

        </div>
  )
}
