
export type createUserParams = {
    username : string,
    email : string;
    display_name : string,
    password_hashed: string;
    avatar_url: string;
}


export type UserCredentialsParams = {
    email: string;
    password_hashed: string;
}

export type RequestTypes = {
    id : string;
    user : User;
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


export type   ConversationTypes= {
    id : string;
    sender : User;
    recipient : User;
    createdAt : string;
    lastMessage: MessageType;
}

export type AcceptRequestParams ={
    idRequest : string;
}

export type UsersTypes = {
    id : string;
    email : string;
    username : string;
    display_name : string;
    avatar_url : string;
}


export type FriendsTypes = {
    id : string;
    display_name : string;
    username : string;
    avatar_url : string;
    friend : User;
}

export type BloquesTypes = {
    id : string;
    display_name : string;
    username : string;
    avatar_url : string;
    userBloque : User;
}


export type MessageType = {
    id: number;
    content: string;
    createdAt: string;
    sender: User;
  };

export type ConversationMessage = {
    id: number;
    messages: MessageType[];
  };

export type FetchMessagePayload = {
    id: number;
    messages: MessageType[];
};

export type messageTypes = {
    id : string;
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
    display_name : string;
    // message : string;
}

export type CreateRequestParams = {
    display_name : string;
}

