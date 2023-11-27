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
    const route = useRouter()
    const { updateChannel,channel} = useContext(socketContext);

    const goBack =() =>
    {
        if(pathname.includes('groups'))
            updateChannel("")
        else
            route.push('/dashboard/chat')

    }

    useEffect(() => {
        setUpdateRome(false)
    }, [channel])
    console.log(channel)
    
    return (<div className="flex items-center justify-between p-5 rounded-full text-black  bg-[#F2F3FD]">
            <div className="flex items-center">
                    <FaArrowLeft  onClick={goBack} className="mr-4 xl:hidden block" size={26}></FaArrowLeft>
                    {pathname.includes('groups') ? <img src={channel.picture} className="w-[50px]" alt="" srcset="" /> :<AvatarStyle/>}
                    
                    {pathname.includes('groups') ? <h1 className="ml-2">{channel.name }</h1> :<h1 className="ml-2">soukaina ouchen</h1>}
            </div>
            {
                channel?.members[0].isAdmin ? (
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