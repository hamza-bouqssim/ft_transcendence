"use client"
import { InputField, MessageContainerStyle, MessagePanelStyle, MessagePannelBody, MessagePannelHeaderStyle } from "../../utils/styles"
import MessageContainer from "./MessageContainer";
import MessageInputField from "./MessageInputFieldRoom";
import { ConversationTypes, messageTypes } from "../../utils/types";
import { FC, useState } from "react";
import MessagePanelHeader from "./MessagePanelHeader";
import { usePathname } from "next/navigation";
import { postNewMessage } from "../../utils/api";
import UpdateComponent from "../updateComponent/UpdateComponent";
import { InfoRoom } from "../InfoRoom/InfoRoom";
import {useContext,useEffect} from 'react'
import MessageContainerRoom from "./MessageContainerRoom";
import { socketContext } from "../../utils/context/socketContext";


const MessagePanel = () => {

    const [updateRome,setUpdateRome] = useState<boolean>(false)
    const pathname = usePathname()
    const { updateChannel, channel } = useContext(socketContext);
    const [olddata, setOldData] = useState<ConversationTypes | null>(null);
    
    useEffect(() => {
      

        if (channel) {
            setOldData(channel);
        }
    }, [channel]);
     
    return (
        <div className="p-2 md:p-6   h-full flex items-center w-full justify-between"> 
                <div className="md:w-[60%] h-full w-full"> 
                    <MessagePanelHeader 
                        setUpdateRome={setUpdateRome}
                        updateRome={updateRome}  
                        setOldData={setOldData} 
                        olddata={olddata}
                    />
                    { !updateRome ? 
                        <>
                            {pathname.includes('chat') ? 
                             <MessageContainer />:
                             <MessageContainerRoom/>
                            }
                        </>
                        :
                        <UpdateComponent 
                            olddata={olddata} 
                            setOldData={setOldData}
                        ></UpdateComponent>
                    }
                </div>
            <div className="hidden md:block md:w-[40%]  pl-4  h-full ">
                <InfoRoom></InfoRoom>
            </div>

        </div>
    )
}
export  default MessagePanel;