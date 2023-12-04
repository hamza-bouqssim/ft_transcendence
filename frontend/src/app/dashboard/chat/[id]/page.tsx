"use client"

import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
import MessagePanel from "@/app/components/messages/MessagePanel";




const ConversationChannelPage = () => {

  
    return ( 
            <div className=" flex h-screen  xl:container xl:mx-auto">
              <div className ="hidden xl:block h-full w-[35%] p-10 pl-5 pr-2 ">
                <CoversationSideBar/>
              </div>
                <div className="bg-white xl:m-10  xl:mr-10 xl:ml-2 w-full xl:w-[65%]  xl:rounded-[20px]">
                    <MessagePanel ></MessagePanel> 
                </div>
            </div>
     );
}
 
export default ConversationChannelPage;