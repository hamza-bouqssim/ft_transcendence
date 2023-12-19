import { getAllMembers } from '@/app/store/memberSlice';
import { socketContext } from '@/app/utils/context/socketContext';
import React ,{useContext,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineMoreVert } from "react-icons/md";
import Image from 'next/image';
import ListUser from './ListUser';

export const Ban = () => {
  const { members, status, error } = useSelector((state:any) => state.member);
  const { channel } = useContext(socketContext);
  console.log("hi")

  if (status =="loading") {
    return(
      <div className="flex items-center justify-center mt-5">
      <div
            className=" text-[#5B8CD3]   h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
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
      {members && members.length > 0 ? (
        members
          .filter((member) => member.Status === 'Member' || member.Status === 'Mut')
          .map((filteredMember) => (
            <ListUser key={filteredMember.id} member={filteredMember} />
          ))
      ) : (
        <div>Not found</div>
      )}
    </div>
  );
}
