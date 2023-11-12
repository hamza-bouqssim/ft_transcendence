import { MessageInputFieldContainer, MessageInput, BtnStyling } from "@/app/utils/styles"
import { Dispatch, SetStateAction, FC } from "react";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.css"

type props = {
    content : string;
    setContent : Dispatch<SetStateAction<string>>;
    sendMessage : (e: React.FormEvent<HTMLFormElement>) => void;
}

const MessageInputField: FC<props> = ({content, setContent, sendMessage}) => {
    return (<MessageInputFieldContainer>
        <form onSubmit={sendMessage}>
            <MessageInput placeholder="Create a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
            <BtnStyling>
                {/* <FontAwesomeIcon icon="paper-plane" className="font"/> */}
            </BtnStyling>

        </form>
    </MessageInputFieldContainer>)
}

export default MessageInputField