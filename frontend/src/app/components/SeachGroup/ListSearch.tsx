import { ConversationTypes } from '@/app/utils/types';
import Image from 'next/image';
import { socketContext } from '@/app/utils/context/socketContext';
import React, { useState, useEffect, useContext, FC } from 'react';
import { useDispatch, useSelector } from "react-redux";

interface ListSearchProps {
  data: ConversationTypes;
}

export const ListSearch: FC<ListSearchProps> = ({ data }) => {
  const { updateChannel, channel } = useContext(socketContext);
  const { rooms} = useSelector((state:any) => state.room);

  return (
    <div key={data.id} className="flex text-black items-center justify-between my-4">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Image className=" w-[70px] h-[70px] rounded-full" src={data.picture} alt={data.name} height={30} width={30} />
        </div>
        <div className="ml-2">
          <h2>{data.name}</h2>
          <h2 className="text-[13px] text-slate-400">{data.Privacy}, {data.members.length} Members</h2>
        </div>
      </div>
            {

			rooms.find((room:ConversationTypes ) => room.id === data?.id)  ? null
            : 
            <button onClick={() => { updateChannel(data) }} className="bg-[#5B8CD3] text-white text-[14px] p-2 rounded-full">Join Room</button>
        }
    </div>
  );
};
