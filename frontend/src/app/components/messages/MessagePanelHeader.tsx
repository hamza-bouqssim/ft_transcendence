"use client"
import { AvatarStyle, MessageItemAvatar, MessagePannelHeaderStyle } from "@/app/utils/styles"
import { IoMdSettings } from "react-icons/io";
import {usePathname,useRouter} from 'next/navigation'
import { IoClose } from "react-icons/io5";
import {FC} from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useContext,useEffect } from "react";
import {socketContext } from "@/app/utils/context/socketContext";

interface MessagePanelHeaderProps {
    setUpdateRome: (value: boolean) => void;
    updateRome: boolean;
}
const MessagePanelHeader: FC<MessagePanelHeaderProps> = ({ setUpdateRome, updateRome }) => {
    const pathname = usePathname()
    const { updateChannel,channel} = useContext(socketContext);
    const goBack =() =>
    {
        updateChannel("")
    }

    useEffect(() => {
        setUpdateRome(false)
    }, [channel])
    
    return (<div className="flex items-center justify-between p-5 rounded-full text-black  bg-[#F2F3FD]">
            <div className="flex items-center">
                    <FaArrowLeft  onClick={goBack} className="mr-4 xl:hidden block" size={26}></FaArrowLeft>
                    {channel.picture && <img src={channel.picture} className="w-[50px] rounded-full" alt="" srcset="" />}
                    {!channel.picture && channel.recipient.avatar_url && <img src={channel.recipient.avatar_url} className="w-[50px] rounded-full" alt="" srcset="" />}
                    {channel.name && <h1 className="ml-2">{channel.name }</h1>}
                    {!channel.name && channel.recipient.display_name && <h1 className="ml-2">{channel.recipient.display_name }</h1>}
            </div>
            {
               channel.members && channel?.members[0].isAdmin ? (
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