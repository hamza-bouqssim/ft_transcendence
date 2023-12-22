import React ,{useContext} from 'react';
import Image from 'next/image';
import { socketContext } from '@/app/utils/context/socketContext';

interface LastMessage {
  id: string;
  content: string;
  createdAt: Date;
}

interface Member {
  user_id: string;
  isAdmin: boolean;
}

interface Room {
  id: string;
  name: string;
  Privacy: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
  messageRome: LastMessage[];
}

interface ListRomeProps {
  data: Room;
  // updateChannel: (data: Room) => void;
}

const ListRome: React.FC<ListRomeProps> = (data:Room) => {
  console.log("xzcxzc",data)
  const {channel,updateChannel} = useContext(socketContext)
  return (
    <div key={data.data.id} onClick={() => updateChannel(data.data)} className="cursor-pointer rounded-[10px] hover:bg-[#F2F3FD] flex items-center justify-between px-2 py-3">
      <div className="flex items-center justify-start">
        <Image className="w-16 h-16 bg-cover rounded-full" src={data.data.picture} alt="" height={30} width={30} />
        <div className="ml-4">
          <h1>{data.data.name}</h1>
          {data.data.messageRome && data.data.messageRome.length > 0 ? (
            <h1 className="text-[12px] text-gray-400">{data.data.messageRome[0].content}</h1>
          ) : (
            <h1 className="text-[12px] text-gray-400">new room</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListRome;
