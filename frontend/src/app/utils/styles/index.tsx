import styled from 'styled-components'
import { InputContainerProps, PageProps } from './styleTypes';

export const InputField = styled.input`
    background-color: #1e1b34;
    border: none;
    color : #fff;
    font-family: 'Inter';
    font-size: 18px;
    width: 100%;
    margin : 4px 0;

`;



export const Body = styled.body`
    margin: 0;
    padding: 0;
    background-color: var(--dark-purple-color);
    background-image: url("/assets/background.svg");
    background-repeat: no-repeat;
    background-size: cover;
    overflow-x: hidden;
`;

export const InputContainer = styled.div<InputContainerProps>`
    background-color: ${(prop) => prop.backgroundColor || '#1e1b34'};
    padding: 12px 16px;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;

`;

export const InputLabel = styled.label`
    display: block;
    color: 	#808080;
    font-size : 14px;
    margin: 4px 0;

`;

export const Button = styled.button`
    width: 100%;
    background-color: #fc7785;
    border: none;
    outline: none;
    font-family: 'Inter';
    font-size: 12px;
    border-radius: 10px;
    padding: 10px 0;
    font-weight: 500;
    transition: 250ms background-color ease;
    &:focus{
        background-color: #972f39;
        border: 2px solid #fff;
    }
    &:hover {
        cursor: pointer;
        background-color: #972f39;
        border: 2px solid #fff;
    }
    &:active {
        background-color: #498cda;
    }

`;
export const Page = styled.div<PageProps>`
   
    height: 100%;
    display: ${(props) => props.display};
    justify-content: ${(props) => props.alignItems}
`;


export const Conversation = styled.aside`
   
    background-color: #fff;
    border-right: 5px solid #0000003a;
   
    overflow-y: scroll;
    
    /* &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #fc7785;
        width: 5px;
        border-radius: 20px;
    } */

    & header{
        background-color:#1e1b34;
        height: 30px;
        width: 350px;
        color : #fff;
        & h1 {
            font-weight: 200;
        }
        align-items : center;
        justify-content: space-between;
        border-bottom: 3px solid #080a0d;
        padding : 0 57px;
        
    }
    
   
    
  
`;

export const ConversationChannelStyle = styled.div`
    position: absolute;
    padding: 20px;
    margin-top: 50px;
    margin-left: 550px;
    width: 35rem;
    height: 30rem;
    align-items: center;
    background-color: #fff;
    border-radius: 50px;
  

    
`;

export const ConversationPannelStyle = styled.div`
    /* position: absolute; 
    top:0;  
    margin-left: 350px;
    width: 35rem;
    height: 100%;
    align-items: center;
    background-color: #fff;
   
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #fc7785;
        width: 5px;
        border-radius: 20px;
    }


    background-color: #1d1a33; */
    & h1{
        margin-left: 500px;
        text-align: center;
        padding :100px;
        margin-top : 160px;
        font-weight: bold;

        
    }

`;

export const ConversationSideBarContainer = styled.div `
    padding: 10px;
`;

export const ConversationSideBarItem = styled.div `


    padding: 9px 2px;
    display: flex;
    align-items: center;
    height: 100%;
    gap: 20px;
    border-bottom: 1px solid #1e1b34;
    box-sizing: border-box;

`;

export const ModalContentBodyStyle = styled.div `

        padding: 18px;


`;

export const OverlayStyle = styled.div `

    height: 100%;
    width: 100%;
    background-color : #0000008a;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;

`;



export const ModalHeadersStyle = styled.header`
    width: 100%;
    background-color:#423f5a;
    padding: 10px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & h2 {
        font-weight:500;
        margin: 0;
        margin-top:23px; 
        
    }
`;

export const ModalContainerStyle = styled.div `

    background-color: #121212;
    width: 650px;
    box-sizing: border-box;
    border-radius: 10px;
`;


export const TextField = styled.textarea`
    
    background-color: #1e1b34;
    border: none;
    color : #fff;
    font-family: 'Inter';
    font-size: 18px;
    width: 100%;
    margin : 4px 0;
`;

export const MessagePanelStyle = styled.div `

    background : inherit;
    height : 100%;
    width: 60%;

`;
export const MessagePannelBody = styled.div `

   
    height: 100%;
    display: flex;
    flex-direction : column;
    padding: 32px 32px 0 32px;
    padding-top: 0;
    box-sizing: border-box;
    flex: 1 1 auto;
    overflow-y: scroll;
    
    &::-webkit-scrollbar {
        width: 8px;
    }
   
   
`

export const MessagePannelHeaderStyle = styled.header `
    background-color: #F2F3FD;
    border-radius: 50px;
    height: 70px;
    box-sizing: border-box;
    color: #151515;
    width: 100%;
    font-weight: bold;
    flex-shrink: 0;
    border-bottom: 1px solid #49494925;
    display: flex;
    text-align: center;
    align-items: center;
    gap: 10px;
    padding: 10px;
`

export const MessageContainerStyle = styled.div `
    box-sizing: border-box;
    padding: 6px 0;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #fc7785;
        width: 5px;
        border-radius: 20px;
    }
`;

export const MessageInputFieldContainer = styled.div `
    box-sizing : border-box;
    margin: 12px;
    background-color : #cfd3ff;
    border-radius : 5px;
`;

export const MessageInput = styled.input `
    background-color: #F2F3FD;
    outline: none;
    border: none;
    color: #151515;
    font-family: 'Inter';
    box-sizing: border-box;
    font-size: 18px;
    font-weight: bold;
    width: 30rem;
    padding: 4px;
    margin: 4px 0;


  
`;

export const MessageItemContainer = styled.div `
        display : flex;
        gap : 20px;
        align-items: center;
        padding: 5px 0;
        word-break: break-word;
`;


export const MessageItemAvatar = styled.div`
    width : 40px;
    height : 40px;
    background-color : #1e1b34;
    border-radius : 50%;
`;
export const AvatarStyle = styled.div `
    width : 40px;
    height: 40px;
    background-color: #1e1b34;
    border-radius: 50%;

`


export const MessageItemDetails = styled.div `
    flex: 1;

`;

export const MessageItemHeader = styled.div `
    display: flex;
    align-items : center;
    gap : 12px;
    .time{
        color : #6d6d6d;
        font-size : 12px;
        font-weight : bold;
    }
    .senderName {
        font-weight : 600;
        font-size : 16px;
        font-weight : bold;
    }
`;

export const  MessageItemContent = styled.div `
      color: #151515;
      font-weight: bold;
      background-color: #F2F3FD;
      border-radius: 60px;
      padding : 3px;

`;

export const Dark = '#131313'