import { MessageInputFieldContainer, MessageInput, BtnStyling } from "@/app/utils/styles"
import { Dispatch, SetStateAction, FC } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";



type props = {
    content : string;
    setContent : Dispatch<SetStateAction<string>>;
    sendMessage : (e: React.FormEvent<HTMLFormElement>) => void;
    sendTypingStatus : () => void;
}

const MessageInputField: FC<props> = ({content, setContent, sendMessage}) => {
    return (
        <div className="flex items-center justify-between ">
            <CiImageOn className="text-[#5B8CD3] mr-5 " size={40}/>
            <form onSubmit={sendMessage} className="w-full  flex items-center bg-[#F2F3FD]  rounded-full justify-between">
                <input className="w-full p-4 py-3 bg-[#F2F3FD] rounded-full  focus:outline-none text-[#949494]" placeholder="Type a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
                <button className="bg-[#5B8CD3]  py-1 px-4 mr-2 rounded-full" type="submit"><LuSendHorizonal size={32} /></button>
            </form>
        </div>
    )
}

export default MessageInputField