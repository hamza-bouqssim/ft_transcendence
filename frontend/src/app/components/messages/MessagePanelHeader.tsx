"use client"
import { AvatarStyle, MessageItemAvatar, MessagePannelHeaderStyle } from "@/app/utils/styles"
import { IoMdSettings } from "react-icons/io";
import {usePathname,useRouter} from 'next/navigation'
import { IoClose } from "react-icons/io5";
import {FC,useState} from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useContext,useEffect } from "react";
import {socketContext } from "@/app/utils/context/socketContext";
import { useDispatch, useSelector } from 'react-redux';
import { getAllMembers } from "@/app/store/memberSlice";
import { HiOutlineLogout } from "react-icons/hi";
import Image from "next/image";
import { User } from "@/app/utils/types";
import { updateRooms } from "@/app/store/roomsSlice";
import { ToastContainer, toast } from 'react-toastify';
interface Room {
    id: string;
    name: string;
    Privacy: string;
    password?:string;
    picture: string;
    createdAt: string;
    updatedAt: string;
    members: {
      isAdmin: boolean;
    };
  }
interface MessagePanelHeaderProps {
    setUpdateRome: (value: boolean) => void;
    updateRome: boolean;
}

interface Member {
  isAdmin: boolean; 
  user_id: string; 
}
const MessagePanelHeader: FC<MessagePanelHeaderProps> = ({ setUpdateRome, updateRome }) => {
    const pathname = usePathname()
    const { members, status, error } = useSelector((state:any) => state.member);
    const dispatch = useDispatch();
    const [isTyping, setIsTyping] = useState(false);
    const socket = useContext(socketContext).socket
    const { updateChannel,channel} = useContext(socketContext);
    const {Userdata} = useContext(socketContext)

    const goBack =() =>
    {
        updateChannel(null)
    }
    useEffect(() => {
        const handleTyping = (typing: any) => {
          if (typing.userId !== Userdata?.id) {
            setIsTyping(typing.status);
          }
        };
      
        socket.on('Typing', handleTyping);
        socket.on('leaveTyping', handleTyping);
      
        return () => {
          socket.off('Typing', handleTyping);
          socket.off('leaveTyping', handleTyping);
        };
      }, [Userdata?.id, socket]);

    useEffect(() => {
        setUpdateRome(false)
    }, [channel, setUpdateRome])

    useEffect(() => {
        dispatch(getAllMembers(channel?.id))
      }, [dispatch,channel])

    // Image src
    const InfoRecipient = () =>{
        let test : User | undefined;
        if(channel?.recipient.display_name === Userdata?.display_name){
            test = channel?.sender;
        }else
            test  = channel?.recipient;
        return test;

    }
     
  const [olddata, setOldData] = useState<Room | null>(null);
  useEffect(() => {
    if (channel) {
      setOldData(channel);
    }
  }, [channel]);

const handleUpdate = () => {
  dispatch(updateRooms(olddata)).then((res)=>{
    if(res.error)
    {
      toast.error(res.payload)
    }
  })
};

    
    return (<div className="flex items-center justify-between p-5  rounded-full text-black  bg-[#F2F3FD]">
            <div className="flex items-center">
                    <FaArrowLeft  onClick={goBack} className="mr-4 xl:hidden block" size={26}></FaArrowLeft>
                    {channel?.picture && <Image src={channel.picture} className="w-[50px] rounded-full" alt=""  width={30} height={30} />}
                    {!channel?.picture &&  InfoRecipient()?.avatar_url  && <Image src={InfoRecipient()?.avatar_url} className="w-[50px] rounded-full" alt="" width={30} height={30} />}
                    {channel?.name && 
                    <div>
                        <h1 className="ml-2">{channel.name }</h1>
                        {isTyping ? 
                            <h1 className="ml-2 text-[12px]">Someone is typing...</h1>
                            :<h1 className="ml-2 text-[12px]">{members.length} Members</h1>
                        }
                    </div>
                    }
                    {!channel?.name && channel?.recipient.display_name && <h1 className="ml-2">{InfoRecipient()?.display_name }</h1>}
            </div>
            {
                pathname.includes('groups') &&
                members?.some(
                    member => (member.Status==="Owner" || member.Status === "Admin") && member.user_id === Userdata.id
                ) ? (
                    !updateRome ? (
                    <IoMdSettings
                        size={30}
                        onClick={() => {
                        setUpdateRome(true);
                        }}
                        className="text-[#4D4D4D]"
                    ></IoMdSettings>
                    ) : (

                        <div  className="flex flex items-center justify-center ">
                            <button className="mr-3 rounded-full py-2 px-4 text-[--pink-color] w-fit  border border-[--pink-color] text-[14px] " onClick={() => {
                                setUpdateRome(false);
                                }}>
                                close
                            </button>
                            <button  onClick={handleUpdate} className={`${_.isEqual(olddata, channel) ? "  " :"flex items-center justify-center  "} text-white text-[14px] rounded-full px-4 py-2 w-fit  bg-[#EA7F87] px-5 py-2`}>
                                Update
                                {status.update === 'loading'   ?   <div className="flex items-center justify-center ml-3 ">
                                                                     <div
                                                                    className=" text-[white]   h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                                    role="status">
                                                                    <span
                                                                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                                    >Loading...</span>
                                                                    </div>
                                                                    </div> 
                                :  null }
					        </button>

                        </div>

                    )
                ) : null 
            }
        </div>)
}



export default MessagePanelHeader;