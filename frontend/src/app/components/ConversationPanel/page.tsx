import { getAuthUser } from "@/app/utils/api";
import { AuthContext } from "@/app/utils/context/AuthContext";
import { Conversation, ConversationPannelStyle, Page } from "@/app/utils/styles";
import { User } from "@/app/utils/types";
import { useContext, useEffect, useState } from "react";

const ConversationPanel = () => {
    // const { user } = useContext(AuthContext)
    // const auth = useAuth();
    // console.log("hna!")
    // console.log(auth);
    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const controller = new AbortController();
    useEffect(() => {
            setLoading(true);
            // console.log(loading);
            getAuthUser().then(({data}) => {
                // console.log("hello")
                // console.log(data);
                setUser(data);
                // console.log("user here");
                setLoading(false)})
            .catch((err)=> {console.log(err); setLoading(false);});
            return controller.abort();
    }, [])
    // console.log(user);
    return (
        <Page>
                <ConversationPannelStyle>
                    <h1>{user?.username}</h1>
           
                </ConversationPannelStyle>
                
        </Page> 
        
     );
}
 
export default ConversationPanel;