"use client"
import styles from "./page.module.scss"
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, Page } from "@/app/utils/styles"
import { ConversationTypes, User } from "@/app/utils/types"
import {MdPostAdd} from 'react-icons/md'
import { FC, useContext, useEffect, useState } from "react"
import ConversationSearch from "../ConversationSearch/page"
import Link from "next/link"
import {useRouter} from "next/navigation"
import { userAgent } from "next/server"
import { Overlay } from "../Overlay"
import { CreateConversationModal } from "../modals/CreateConversationModal"
import { AuthContext } from "@/app/utils/context/AuthContext"
import { getAuthUser } from "@/app/utils/api"
import { RootState } from "@/app/store"
import { useDispatch, useSelector } from "react-redux"

type Props = {
	conversations: ConversationTypes[];
}

const CoversationSideBar: FC <Props>  = ({conversations}) => {
	const conversation = useSelector((state: RootState) => state.conversation.conversations);
	const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
	const controller = new AbortController();

    useEffect(() => {
            setLoading(true);
            getAuthUser().then(({data}) => {
                setUser(data);
                setLoading(false)})
            .catch((err)=> {console.log(err); setLoading(false);});
    }, [user])
	const router = useRouter();

	const [show, setShow] = useState<any>(false);
	const getDisplayUser = (conversation : ConversationTypes) => {
		const userId = user?.username;
		
		
		let test;
		if(conversation.sender.username!= userId)
		{
		
			test = conversation.sender
		}else if(conversation.sender.username == userId)
		{
			test = conversation.recipient;
		}	
		return test;
	}

	

    return (
		<Page>
			{show && <CreateConversationModal   setShow={setShow} />   }
			<Conversation>
				<header className={styles.header}>
					<h1 className={styles.h1}>Conversations</h1>
					<div onClick={() => setShow(!show)}>
						<MdPostAdd size={30}/>
					</div>
					

				</header>
				<div>
					<ConversationSearch/>
				</div>
				{/* <div>
					<ChatOrGroups/>
				</div>
				 */}

				<ConversationSideBarContainer>
					{conversations.map(function(elem){
						function handleClick()
						{
							router.push(`/dashboard/chat/${elem.id}`)
						}
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className={styles.avatar}></div>
								<div>
					 				<span onClick={handleClick} className={styles.ConversationName}>{getDisplayUser(elem)?.username}</span>
					 				<span className={styles.lastName}>text Message</span>
					 			</div>
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>


		</Page>
        
			
			
       
     );
}
 
export default CoversationSideBar;