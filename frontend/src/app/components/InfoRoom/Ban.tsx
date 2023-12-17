import { getAllMembers } from '@/app/store/memberSlice';
import { socketContext } from '@/app/utils/context/socketContext';
import React ,{useContext,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CiMenuKebab } from "react-icons/ci";
import Image from 'next/image';

export const Ban = () => {
  const { members, status, error } = useSelector((state:any) => state.member);
  const { channel } = useContext(socketContext);
  console.log("hi")

  if (status =="loading") {
    return(
      <div className="flex items-center justify-center mt-40">
      <div
            className=" text-[#5B8CD3]   h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span>
      </div></div>)
  }
  
  if (status === 'failed') {
    return <div className="text-gray-500 mt-10 text-center ">{error} </div>;
  }

  return (
    <div>
       <div>
        {members.map((user) => (
        user.Status === 'Ban' ? (
          <div key={user.id} className="flex items-center justify-between relative">
            <div className="flex items-center my-1">
              <div>
                <Image src={user.user.avatar_url} alt="" className="w-10 rounded-full" width={30} height={30}/>
              </div>
              <div className="text-[13px] flex flex-col justify-center ml-2">
                <h1>{user.user.username}</h1>
                <h1>{user.user.display_name}</h1>
              </div>
            </div>
            <CiMenuKebab onClick={() => {}} />
          </div>
        ) : null
      ))}
    </div>
    </div>
  );
}
