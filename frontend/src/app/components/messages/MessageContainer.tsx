import {AvatarStyle, MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { ConversationTypes, User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "@/app/utils/api";
import Image from "next/image";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { useParams } from "next/navigation";

type Props  = {
    messages : messageTypes[];
}
const MessageContainer  : FC<Props>  = ({messages}) => {
    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [conversation, setConversation] = useState<ConversationTypes[]>([]);

    const controller = new AbortController();
    useEffect(() => {
            setLoading(true);
            getAuthUser().then(({data}) => {  
                setUser(data);
                setLoading(false)})
            .catch((err)=> { setLoading(false);});
    }, [])
	const dispatch = useDispatch<AppDispatch>();

    useEffect (() => {
        dispatch(fetchConversationThunk())
        .unwrap()
        .then(({data}) => {
          setConversation(data);
        }).catch((err)=>{
          console.log(err);
        }
        );
      },[conversation])
      
      const {id} = useParams();
      const selectedConversation = conversation.find((conv) => conv.id === id);
      console.log("conversation here-->", selectedConversation);
      const recipientUser = selectedConversation?.recipient;

    const functionSearchUsers = () =>{


    }  

    // const functionHandleDisplay_name = () =>{
    //     let test;
    //         messages.map((elem)=>{
    //             test = elem.recipient.display_name;

    //         })
    //         return test;
    // }

    const functionHandleAvatarUrl = () =>{
        let test;
            messages?.map((elem)=>{
                test = elem.recipient.avatar_url;

            })
            return test;


    }
    const functionHandleUserName = () =>{
        let test;
            messages?.map((elem)=>{
                test = elem.recipient.username;

            })
            return test;
    }

    return (
        
    <div className="h-[calc(100%-121px)] overflow-auto py-3">
        <div className="flex items-center justify-between p-5 rounded-full text-black  bg-[#F2F3FD]">
            <div className="flex items-center">
            <Image src={recipientUser?.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

                    <h1 className="ml-2">{recipientUser?.username}  {recipientUser?.display_name}</h1>
            </div>
        </div>
        <MessageContainerStyle>
        
         {messages && messages.map((m) =>(
            <MessageItemContainer key={m.id}>
                <Image src={m.sender.avatar_url} className="h-10 w-10 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                        <MessageItemDetails>
                            <MessageItemHeader key={m.id}>
                            <span className="senderName" style={{color : user?.id === m.sender.id ? '#8982a6' : '#778ba5'}}>
                                {m.sender.username}
                            </span>
                            <span className="time">
                                {formatRelative(new Date(m.createdAt), new Date())}
                            </span>
                            </MessageItemHeader>
                            <MessageItemContent>{m.content}</MessageItemContent>
                        </MessageItemDetails>

            </MessageItemContainer>
         ) )}
         </MessageContainerStyle>
    </div>
    )
}

export default MessageContainer;