import styled from 'styled-components'
import { InputContainerProps, PageProps } from './styleTypes';

export const InputField = styled.input`
    background-color: #F2F3FD;
    border: none;
    color : #151515;
    font-family: 'Inter';
    font-size: 18px;
    width: 100%;
    padding: 10px;
    border-radius: 10px;

`;
export const InputFieldStyling = styled.input`
    /* background-color: #F2F3FD; */
    border: none;
    color : #151515;
    font-family: 'Inter';
    font-size: 18px;
    width: 50rem;
    padding: 4px;
    border-radius: 10px;

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


export const SearchResultStyling = styled.div`
    padding : 10px;
    background-color: #151515;
`

export const containerStylingName = styled.div`
    font-size: 10px;
    font-weight: bold;
    display: grid;
`

export const InputContainer = styled.div<InputContainerProps>`
    display: flex;
    background-color: ${(prop) => prop.backgroundColor || '#1e1b34'};
    padding: 12px 16px;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;

`;

export const InputContainerSearching = styled.div<InputContainerProps>`
    background-color: ${(prop) => prop.backgroundColor || '#1e1b34'};
    padding: 12px 16px;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;

`;

export const ContainerStyling = styled.div`
    display: flex;
   

`;

export const StylingForm = styled.div`

    padding : 30px;
     & h1{
        padding : 10px;
        font-size: 20px;
        font-weight: bold;
        color: #fc7785;
        text-align: center;
    }
`

export const InputLabel = styled.label`
    display: block;
    color: 	#5e5d5d;
    font-size : 14px;
    font-weight: 20px;
    margin: 4px 0;

`;

export const Button = styled.button`
    width: 100%;
    background-color: #fc7785;
    border: none;
    outline: none;
    font-family: 'Inter';
    font-size: 17px;
    border-radius: 10px;
    padding: 10px;
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
export const ButtonStyling = styled.button`
    width: 100%;
    background-color: #fc7785;
    border: none;
    outline: none;
    font-family: 'Inter';
    font-size: 17px;
    border-radius: 10px;
    padding: 10px;
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

export const BtnStyling = styled.button`
    width: 80px;
    background-color: #5B8CD3;
    border: none;
    border-radius: 10px;
    padding: 15px;
    margin : 11px;
`;
export const Page = styled.div<PageProps>`
   
    height: 100%;
    display: ${(props) => props.display};
    justify-content: ${(props) => props.alignItems}
`;


export const Conversation = styled.aside`
   
    background-color: #fff;
    border-right: 5px solid #0000003a;
   
    
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
        padding : 20px;
        
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


export const OnlineStyling = styled.div`

    background-color: green;
    border-radius: 50%;
    width : 12px;
    height : 12px;
    margin-left: -1rem;
`;

export const OflineStyling = styled.div`

    background-color: red;
    border-radius: 50%;
    width : 12px;
    height : 12px;
    margin-left: -1rem;
`;

export const IngameStyling = styled.div`

    background-color: blue;
    border-radius: 50%;
    width : 12px;
    height : 12px;
    margin-left: -1rem;
`;

export const ConversationSideBarItem = styled.div `

    background-color: white ;
    /* padding: 9px; */
    display: flex;
    align-items: center;
    height: 100%;
    gap: 20px;
    margin: 10px 0;
    /* border-bottom: 1px solid #1e1b34; */
    box-sizing: border-box;

    
`;

export const ModalContentBodyStyle = styled.div `

        padding: 18px;


`;
export const ModalContentBodySearchingStyle = styled.div `

        padding: 18px;


`;

export const OverlayStyle = styled.div `

    height: 400px;
    width: 400px;
    margin-left : 300px;
    background-color : #0000008a;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;

`;

export const OverlayStyleSearching = styled.div `

    height: 800px;
    width: 800px;
    margin-left : 300px;
    background-color : #0000008a;
    position: fixed;
    display: flex;
    /* justify-content: center;
    align-items: center; */
    z-index: 99;

`;



export const ModalHeadersStyle = styled.header`
    width: 100%;
    background-color:#5B8CD3;
    padding: 10px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & h2 {
        font-weight:300;
        margin: 0;
        margin-top:3px; 
        
    }
`;


export const ModalHeadersSearchingStyle = styled.header`
    width: 100%;
    background-color:#5B8CD3;
    padding: 10px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & h2 {
        font-weight:300;
        margin: 0;
        margin-top:3px; 
        
    }
`;

export const ModalContainerStyle = styled.div `

    background-color: #0000008a;
    width: 300px;
    box-sizing: border-box;
    border-radius: 40px;
`;

export const ModalContainerSearchingStyle = styled.div `

    background-color: #0000008a;
    width: 800px;
    box-sizing: border-box;
    border-radius: 40px;
`;


export const TextField = styled.textarea`
    
    background-color: #fff;
    border: none;
    color : #151515;
    font-family: 'Inter';
    font-size: 18px;
    width: 100%;
    margin : 4px 0;
    border-radius: 20px;
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
export const FirstGroup = styled.div `
    display: flex;
    gap : 10px;
    & h2{
        font-size: 20px;
        font-weight: bold;
    }
`

export const MessagePannelHeaderStyle = styled.header `
    background-color: #F2F3FD;
    border-radius: 50px;
    height: 80px;
    box-sizing: border-box;
    color: #151515;
    width: 100%;
    border-bottom: 1px solid #49494925;
    /* text-align: center;*/
    /* align-items: center;  */
    /* gap: 10px; */
    padding : 17px;
   
   
`

export const MessageContainerStyle = styled.div `
    box-sizing: border-box;
    display: flex;
    flex-direction: column-reverse;
   
`;

export const MessageInputFieldContainer = styled.div `
    box-sizing : border-box;
    margin: 30px;
    background-color : #dddffe;
    border-radius : 30px;
`;

export const MessageInput = styled.input `
    background-color: #F2F3FD;
    outline: none;
    border: none;
    color: #151515;
    font-family: 'Inter';
    box-sizing: border-box;
    font-size: 15px;
    font-weight: bold;
    width: 30rem;
    margin: 4px 0;
    resize: none;
    padding : 10px;

  
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
export const DivStyle = styled.div`
    display: flex;
    margin-left: 50px;
    gap: 8px;
  
  
    & h1{
        font-size : 9px;
        font-weight: bold;
    }
`

export const OnlineStyle = styled.div`
    width: 9px;
    height: 9px;
    background-color: green;
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



export const HeaderOnlineUsers = styled.div`
    height : 90px;
    box-sizing : border-box;
    padding-left : 80px;
    width: 100%;
    flex-shrink: 0;
    color : #151515;
    border-bottom: 1px solid #151515;
    box-shadow: 5px 0 5px #000;
    display: flex;
    align-items: center;
    font-size : 20px;
    font-weight: bold;


`

export const Dark = '#131313'