import { getAuthUser } from "@/app/utils/api";
import { AuthContext } from "@/app/utils/context/AuthContext";
import {
	Conversation,
	ConversationPannelStyle,
	Page,
} from "@/app/utils/styles";
import { User } from "@/app/utils/types";
import { useContext, useEffect, useState } from "react";

const ConversationPanel = () => {
	// console.log(user);
	return (
		<Page>
			<ConversationPannelStyle>
				<h1>INITIATE A CONVERSATION WITH A FRIEND YOU WANT TO PLAY WITH</h1>
			</ConversationPannelStyle>
		</Page>
	);
};

export default ConversationPanel;
