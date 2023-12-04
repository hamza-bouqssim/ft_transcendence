"use client"
import { InputField, MessagePanelStyle, MessagePannelBody, MessagePannelHeaderStyle } from "@/app/utils/styles"
import MessageContainer from "./MessageContainer";
import MessageInputField from "./MessageInputField";
import { messageTypes } from "@/app/utils/types";
import { FC, useState } from "react";
import MessagePanelHeader from "./MessagePanelHeader";
import { useParams } from "next/navigation";
import { postNewMessage } from "@/app/utils/api";
import UpdateComponent from "../updateComponent/UpdateComponent";
import { InfoRoom } from "../InfoRoom/InfoRoom";
import {useContext} from 'react'


const MessagePanel = () => {

        const [updateRome,setUpdateRome] = useState<boolean>(false)
        
     
     
    return (
        <div className="p-2 md:p-6   h-full flex items-center w-full justify-between"> 
                <div className="md:w-[60%] h-full w-full"> 
                    <MessagePanelHeader setUpdateRome={setUpdateRome} updateRome={updateRome} />
                    { !updateRome ? 
                        <>
                            <MessageContainer />

                        </>
                        :
                        <UpdateComponent></UpdateComponent>
                    }
                </div>
            <div className="hidden md:block md:w-[40%]  pl-4  h-full ">
                <InfoRoom></InfoRoom>
            </div>

        </div>
    )
}
export  default MessagePanel;