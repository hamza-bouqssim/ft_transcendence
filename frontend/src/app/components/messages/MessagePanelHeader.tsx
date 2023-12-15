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


interface MessagePanelHeaderProps {
    setUpdateRome: (value: boolean) => void;
    updateRome: boolean;
}
const MessagePanelHeader: FC<MessagePanelHeaderProps> = ({ setUpdateRome, updateRome }) => {
    const pathname = usePathname()
    const { members, status, error } = useSelector((state:any) => state.member);
    const dispatch = useDispatch();
    const [isTyping, setIsTyping] = useState(false);
    const socket = useContext(socketContext).socket
    const { updateChannel,channel} = useContext(socketContext);
    const {Userdata} = useContext(socketContext)
    console.log("hi")
    const goBack =() =>
    {
        updateChannel("")
    }
    useEffect(() => {
        const handleTyping = (typing) => {
            if(typing.userId!==Userdata.id)
                setIsTyping(typing.status);
        };
      
        socket.on('Typing', handleTyping);
        socket.on('leaveTyping', handleTyping);
      
        return () => {
          socket.off('Typing', handleTyping);
          socket.off('leaveTyping', handleTyping);
        };
      }, []);

    useEffect(() => {
        setUpdateRome(false)
    }, [channel])

    useEffect(() => {
        dispatch(getAllMembers(channel.id))
      }, [dispatch,channel])

    
    return (<div className="flex items-center justify-between p-5  rounded-full text-black  bg-[#F2F3FD]">
            <div className="flex items-center">
                    <FaArrowLeft  onClick={goBack} className="mr-4 xl:hidden block" size={26}></FaArrowLeft>
                    {channel.picture && <img src={channel.picture} className="w-[50px] rounded-full" alt="" srcset="" />}
                    {!channel.picture && channel.recipient.avatar_url && <img src={channel.recipient.avatar_url} className="w-[50px] rounded-full" alt="" srcset="" />}
                    {channel.name && 
                    <div>
                        <h1 className="ml-2">{channel.name }</h1>
                        {isTyping ? 
                            <h1 className="ml-2 text-[12px]">Someone is typing...</h1>
                            :<h1 className="ml-2 text-[12px]">{members.length} Members</h1>
                        }
                    </div>
                    }
                    {!channel.name && channel.recipient.display_name && <h1 className="ml-2">{channel.recipient.display_name }</h1>}
            </div>
            {
              channel.members.some(member => member.isAdmin && member.user_id === Userdata.id) ? (
                    pathname.includes('groups') && !updateRome ? (
                    <IoMdSettings
                        size={30}
                        onClick={() => {
                        setUpdateRome(true);
                        }}
                        className="text-[#4D4D4D]"
                    ></IoMdSettings>
                    ) : (
                    <IoClose
                        size={30}
                        onClick={() => {
                        setUpdateRome(false);
                        }}
                        className="text-[#4D4D4D]"
                    ></IoClose>
                    )
                ) : null
                } 
        </div>)
}



export default MessagePanelHeader;