import React from 'react';
import { MdOutlineMoreVert } from "react-icons/md";
import Image from 'next/image';

interface Props {
  member:any
  }
const ListUser: React.FC<Props> = ({member}) => {
  console.log(member)
  return (
    <div>
      <div key={member.id} className="flex items-center justify-between relative">
            <div className="flex items-center my-1">
              <div>
                <Image src={member?.user.avatar_url} alt="" className="w-10 rounded-full" width={30} height={30}/>
              </div>
              <div className="text-[13px] flex flex-col justify-center ml-2">
                <h1>{member?.user.username}</h1>
                <h1>{member?.Status}</h1>
              </div>
            </div>
            <MdOutlineMoreVert size={25} />
          </div>
    </div>
  );
};

export default ListUser;
