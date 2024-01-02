import React, { useContext ,FC, useEffect, useState} from 'react';
import Image from 'next/image';
import { socketContext } from '../../utils/context/socketContext';
import { ConversationTypes,  } from '../../utils/types';
import { useSelector } from 'react-redux';



interface ListRomeProps {
	data: ConversationTypes;
}

function extractLatestTimestamp(data: ConversationTypes): string {
  const timestamps = [
    new Date(data.createdAt).getTime(),
    new Date(data.updatedAt).getTime(),
    ...(data.messageRome || []).map((message) => new Date(message.createdAt).getTime()),
  ];

  const validTimestamps = timestamps.filter((timestamp) => !isNaN(timestamp));

  const latestTimestamp = new Date(Math.max(...validTimestamps));

  return latestTimestamp.toISOString();
}

function formatTimeDifference(timeDifference:number) {
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else{
    return `${minutes} min`;
  } 
}

const ListRome: FC<ListRomeProps> = ({data} ) => {
  const { channel, updateChannel } = useContext(socketContext);
	const {notificationRoom} = useSelector((state:any) => state.NotificationChat);
  const [number , setNumber] = useState<number>(0);
  useEffect(()=>{
    setNumber(notificationRoom.find((not :any) => not.roomId === data.id)?.number | 0);
  },[notificationRoom,channel])

  return (
    <div key={data.id} onClick={() => updateChannel(data)} className="cursor-pointer rounded-[10px] hover:bg-[#F2F3FD] flex items-center justify-between px-2 py-3">
        <div className="flex items-center w-[70%] justify-start">
          <Image priority className="w-16 h-16 bg-cover rounded-full" src={data.picture} alt="" height={30} width={30} />
          <div className="ml-4 ">
            <h1>{data.name}</h1>
            {data.messageRome && data.messageRome.length > 0 ? (
              <p className="text-[12px] line-clamp-1	w-[70%]   text-gray-400">{data.messageRome[0].content}</p>
              ) : (
                <h1 className="text-[12px]  text-gray-400">new room</h1>
                )}
          </div>
        </div>
        <div className='flex flex-col  items-center justify-between'>
                <div>

                </div>

                  {number != 0  && 
                    <h1 className='bg-[--pink-color] text-[10px] py-[3px] px-[8px] rounded-full text-white'>
                    {number}
                    </h1>
                  } 
                  

                <h1 className='text-[12px] text-gray-400'>
                  {formatTimeDifference(new Date().getTime() - new Date(extractLatestTimestamp(data)).getTime())}
                </h1>
        </div>
    </div>
  );
};

export default ListRome;