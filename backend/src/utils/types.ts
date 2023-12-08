/* eslint-disable prettier/prettier */
import { User } from "@prisma/client";

export type CreateUserDetails = {

    email: string;
    password: string;
    firstName: string;
    lastName: string;

}
export type findUserParams = Partial <{
    id : string;
    email : string;
}>

export type CreateConversationParams = {

    display_name: string;
    // message: string;

}

export type findParticipentParams = {
    id : number;
}

export interface Authenticated_Request extends Request{
    user : User;
}

export type ConversationIdentityType = 'author' | 'recipient'


export type CreateParticipantparams = {
    id : string;
}

export type CreateMessageParams = {
    content : string;
    participentsId : string;

}