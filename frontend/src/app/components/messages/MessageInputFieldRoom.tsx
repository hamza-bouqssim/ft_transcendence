"use client"
import { MessageInputFieldContainer, MessageInput, BtnStyling } from "../../utils/styles"
import { Dispatch, SetStateAction, FC } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";
import { socketContext } from "../../utils/context/socketContext";
import {useContext, useEffect,useState}  from "react"
import { BloqueList, MessageType, User, messageTypes } from "../../utils/types";
import {useRouter,usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlockedUsers, fetchBlocksThunk } from "../../store/blockSlice";
import { AppDispatch } from "../../store";

interface Members {
	id: string;
	user_id: string;
	chatRoomId: string;
	isAdmin: boolean;
	Status: string;
	user: {
		id: string;
		username: string;
		status: string;
		email: string;
		password: string;
		display_name: string;
		avatar_url: string;
		two_factor_auth: string;
		two_factor_secret_key: string;
	};
}

type props = {
    Message : any[];
    setMessage :Dispatch<React.SetStateAction<any>>   
}
interface Member {
  user_id: string; 
  Status: string;  
}
export type BloqueListRoom = {
  id : string;
  userOne : User;
  userTwo : User;

}
const MessageInputFieldRoom: FC<props> = ({setMessage, Message}) => {
    const pathname = usePathname();
    const socket = useContext(socketContext).socket;
    const { channel } = useContext(socketContext);
    const [content, setContent] = useState('');
    const {Userdata} = useContext(socketContext)
    const dispatch = useDispatch<AppDispatch>();
    const { members, status, error } = useSelector((state:any) => state.member);
    const { blocked} = useSelector((state:any) => state.friendsBlock);
    useEffect(() => {
      dispatch(fetchBlockedUsers())
    }, [dispatch]);
    useEffect(() => {
      const handleOnMessage = (message: any) => {
        const isBlocked = blocked.some(
          (elem: BloqueListRoom) =>
            elem.userOne.id === message.senderId || elem.userTwo.id === message.senderId
        );
      
      
        if (!isBlocked || message.senderId === Userdata?.id) {
          setMessage((prevMessages: messageTypes[]) => [...prevMessages, message]);
        }
      };
      
      socket.on('messageRome', handleOnMessage);
      return () => {
          socket.off('messageRome', handleOnMessage);
      };
    }, [channel?.id, socket]);

  
    const sendMessage = async () => {
        if(!content)
            return
      socket.emit("messageRome", { chatRoomId: channel?.id, content: content });
      setContent('');
    };
    const handleEnter =(event:any) => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage();   
      }
    }

    return (
      <>
      { members.some((member : Members) => member.user_id === Userdata?.id && member.Status !== "Mut")?
        <div className="flex items-center justify-between ">
         
            <CiImageOn className="text-[#5B8CD3] mr-5 " size={40}/>
            <div  className="w-full  flex items-center bg-[#F2F3FD]  rounded-full justify-between">
                <input 
                onKeyDown={handleEnter}
                onFocus={() => {
                  socket?.emit('Typing', { id:channel?.id,userId:Userdata?.id});
                }}
                onBlur={() => {
                  socket?.emit('leaveTyping', { id:channel?.id,userId:Userdata?.id});
                }}
                className="w-full p-4 py-3 bg-[#F2F3FD] rounded-full  focus:outline-none text-[#949494]" placeholder="Type a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
                <button onClick={sendMessage} className="bg-[#5B8CD3]  py-1 px-4 mr-2 rounded-full" type="submit"><LuSendHorizonal size={32} /></button>
            </div>

        </div> 
        : <div className="flex items-center justify-between ">
          <h1 className="text-[#5B8CD3]  mx-auto">You can block this discussion to no longer receive messages</h1>
        </div>
        }
      </>
    )
}

export default MessageInputFieldRoom