

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

export type User = {
    id: string;
    email: string;
    username : string;
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
}

export type messageTypes = {
    id : string;
    content : string;
    createdAt : string;
    sender : User;
    recipient : User;
}