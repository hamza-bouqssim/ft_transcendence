import { getAuthUser } from "@/app/utils/api";
import { Conversation, ConversationPannelStyle, Page } from "@/app/utils/styles";
import { User } from "@/app/utils/types";
import { useContext, useEffect, useState } from "react";

const ConversationPanel = () => {

    return (
        <Page>
                <ConversationPannelStyle>
                    <h1>INITIATE A CONVERSATION WITH A FRIEND YOU WANT TO PLAY WITH</h1>
                </ConversationPannelStyle>
                
        </Page> 
        
     );
}
 
export default ConversationPanel;
