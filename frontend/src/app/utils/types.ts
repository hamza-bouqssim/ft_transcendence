
export type createUserParams = {
    username : string,
    email : string;
    display_name : string,
    password_hashed: string;
    avatar_url: string;
}


export type UserCredentialsParams = {
    email: string;
    password: string;
}

export type RequestTypes = {
    id : string;
    user : User;
    friends : User;
}

export type User = {
  
    id: string;
    email: string;
    username : string;
    display_name : string;
    avatar_url : string;
}
export type chat = {
    id : string;
    sender : User;
    recipient : User;
}

  export type CreateChangeParams = {
        display_name: string;
        username: string;
        avatarUrl: string;
        password: string;
      };
      

export type Member = {

        isAdmin: boolean; 
        user_id: string; 
      
} 


export type ConversationTypes = {
	id: string;
	picture: string;
	name: string;
	sender: User;
	recipient: User;
	recipientId: string;
	senderId: string;
	lastMessage: MessageType;
	Privacy: string | "Public";
	password: string | null;
	createdAt: Date;
	updatedAt: Date;
	members: Member[];
	messageRome: lastMessage[];
};
export type lastMessage = {
	id: string;
	content: string;
	createdAt: Date;
};


export type AcceptRequestParams ={
    idRequest : string;
}

export type UsersTypes = {
    id : string;
    email : string;
    username : string;
    display_name : string;
    avatar_url : string;
    status : string;
    name : string;
}

export type UsersType = {
    sub: string;
    email : string;
    username : string;
    display_name : string;
    avatar_url : string;
    status : string;
}


export type FriendsTypes = {
    id : string;
    display_name : string;
    username : string;
    avatar_url : string;
    friend : User;
    status : string;
}

export type BloquesTypes = {
    user : User;
    id : string;
    display_name : string;
    username : string;
    avatar_url : string;
    userBloque : User;
}



export type BloqueList = {
    id : string;
    userOne : User;
    userTwo : User;
}


export type MessageType = {
    id: number;
    content: string;
    createdAt: string;
    sender: User;
  };
export type NotificationTypes = {
    id : string;
    content : string;
    image_content : String;
    type: string;
    requestId : string;

}

export type ConversationMessage = {
    id: number;
    messages: MessageType[];
  };

export type FetchMessagePayload = {
    id: number;
    messages: MessageType[];
};
export type messageUnread = {
    count : number;
}
export type messageTypes = {
    id : string;
    participents :  ConversationTypes;
    content : string;
    createdAt : string;
    sender : User;
}
export type messageEventPayload = {
    id : string;
    createdAt : string;
    conversation: ConversationTypes;
    sender : User;
    content : string;
    recipient : User;
}
export type MessageEventPayload = {
    message: MessageType;
    conversation: ConversationTypes;
  };


export type CreateMessageParams = {
    content : string;
    participentsId : string;
}

export type CreateConversationParams ={
    display_name? : string;
    message : string;
}

export type CreateRequestParams = {
    display_name : string;
}

export type Members = {
	id: string;
	user_id: string;
	chatRoomId: string;
	isAdmin: boolean;
	Status: string;
	user: {
		id: string;
		username: string;
		status: string;
		email: string;
		password: string;
		display_name: string;
		avatar_url: string;
		two_factor_auth: string;
		two_factor_secret_key: string;
	};
}