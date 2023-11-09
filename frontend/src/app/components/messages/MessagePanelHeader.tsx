import { AvatarStyle, DivStyle, FirstGroup, MessageItemAvatar, MessagePannelHeaderStyle, OnlineStyle } from "@/app/utils/styles"

const MessagePanelHeader = () => {
    return (<MessagePannelHeaderStyle>
            <FirstGroup>
                <AvatarStyle/>
                <h2>soukaina ouchen</h2>
            </FirstGroup>
                
                    <DivStyle>
                        <OnlineStyle/>
                        <h1>Online</h1>  
                    </DivStyle>
                       
        </MessagePannelHeaderStyle>)
}



export default MessagePanelHeader;