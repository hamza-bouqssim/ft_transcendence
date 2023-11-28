"use client"
import { AvatarStyle, MessageItemAvatar, MessagePannelHeaderStyle } from "@/app/utils/styles"
import { IoMdSettings } from "react-icons/io";
import {usePathname} from 'next/navigation'

const MessagePanelHeader = () => {
    const pathname = usePathname()
    return (<div className="flex items-center justify-between p-5 rounded-full text-black  bg-[#F2F3FD]">
            {/* <div className="flex items-center">
                    <AvatarStyle/>
                    <h1 className="ml-2">soukaina ouchen</h1>
            </div> */}
            {pathname.includes('groups') &&  < IoMdSettings size={30} className="text-[#4D4D4D]"></IoMdSettings>}
           
        </div>)
}



export default MessagePanelHeader;