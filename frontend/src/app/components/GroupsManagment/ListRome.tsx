import React, { useContext } from 'react';
import Image from 'next/image';
import { socketContext } from '../../utils/context/socketContext';
import { ConversationTypes,  } from '../../utils/types';



interface ListRomeProps {
	data: ConversationTypes;
}

const ListRome: React.FC<ListRomeProps> = (data ) => {
  const { channel, updateChannel } = useContext(socketContext);

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
        <div className='flex flex-col  items-center justify-end'>
                <div>

                </div>
                <div className='bg-[--pink-color] p-3'>
                  7
                </div>
                <h1 className='text-[12px] text-gray-400'>
                  15.5
                </h1>
        </div>
    </div>
  );
};

export default ListRome;