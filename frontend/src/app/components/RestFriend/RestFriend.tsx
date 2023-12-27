"use client"
// import { AppDispatch } from '@/app/store';
// import {  fetchGetAllFriendsThunk } from '@/app/store/friendsSlice';
// import { FriendsTypes, Members, UsersTypes } from '@/app/utils/types';
// import Image from 'next/image';
// import React  , {useEffect,useState,useContext} from 'react'
// import {useDispatch, useSelector} from 'react-redux'
// import {addMemberToRooms ,getAllMembers} from '@/app/store/memberSlice';
// import { socketContext } from '@/app/utils/context/socketContext';

// interface Friend {
//     id: string;
//     username: string;
//     avatar_url: string;
//     display_name: string;
// }



export const RestFriend = () => { 
  // const { friends, status, error } = useSelector((state:any) => state.friends);
  // const dispatch = useDispatch<AppDispatch>();
  // const { members} = useSelector((state:any) => state.member);
  // const { updateChannel,channel} = useContext(socketContext);

  // useEffect(() => {
    

  //   dispatch(fetchGetAllFriendsThunk());
  // }, [dispatch]);

  // const handleAddUser=(friend:string) =>{
  //   dispatch(addMemberToRooms({
  //     userId:friend,
  //     id:channel?.id
  //   })).then((res:any)=>{
  //     if(channel?.id)
  //       dispatch(getAllMembers(channel?.id))
  //   })
  // }

  // if (status =="loading") {
  //   return(
  //     <div className="flex items-center justify-center mt-5">
  //     <div
  //           className=" text-[#5B8CD3]   h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
  //           role="status">
  //           <span
  //             className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
  //             >Loading...</span>
  //     </div></div>)
  // }
  
  // if (status === 'failed') {
  //   return <div className="text-gray-500 mt-10 text-center ">{error} </div>;
  // }

  // const membersId = members.map((member:Members) => member.user_id);
  // const friendsnotinChatRoom = friends.filter((friend:Friend) => !membersId.includes(friend.id));
  

  return (
    <div className="h-fit">
      {/* {friendsnotinChatRoom.length > 0 ? (
        friendsnotinChatRoom.map((friend:Friend) => (
          <div key={friend.id} className="flex items-center justify-between my-2 mt-5">
          <div className="flex items-center justify-center ">
            <div className="relative">
              <Image className="w-14 rounded-full" src={friend.avatar_url} alt={friend.display_name} height={30} width={30}/>
            </div>
            <div className="ml-2 ">
              <h2>{friend.display_name}</h2>
              <h2 className="text-[13px] text-slate-400">{friend.username}</h2>
            </div>
          </div>

            <button onClick={() =>handleAddUser(friend.id) } className="bg-[#5B8CD3] text-white text-[14px] p-2 rounded-[5px]" >Add user</button>
          
        </div>
        ))
      ) : (
        <div className="text-gray-500 mt-10 text-center">No friends<br/> you can add in this chat room</div>
      )} */}
    </div>
  );
}
