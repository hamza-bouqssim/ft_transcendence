import { InputContainer, InputField, InputLabel, TextField } from "@/app/utils/styles"
import styles  from "./index.module.css"
import { Button } from "@/app/utils/styles"
import { useDispatch } from "react-redux"
import { addConversation } from "@/app/store/conversationSlice"
export const CreateConversationForm = () => {

        const dispatch = useDispatch();
    return (
        <form className={styles.formConversation}>
          
                <InputContainer backgroundColor="#87a2c6">
                    <InputLabel>Recepient</InputLabel>
                    <InputField />
                    <InputLabel>Message</InputLabel>
                    <TextField />
                
                </InputContainer>
          <Button onClick={(e) => {e.preventDefault(); 
            // dispatch(addConversation({
            //     id : "",
            //     CreatedAt : Date(),
            //     sender:
            //     {
            //         id:"d60d0967-680b-4f5d-95c1-6c35ac01b607" ,
            //         email:"" ,
            //         username:"",
            //         display_name:"",
            //         avatar_url:"",
            //     },
            //     recipient:
            //     {
            //         id:"7dc418be-3d58-47af-b94c-3039fb9b7c5b" ,
            //         email:"" ,
            //         username:"",
            //         display_name:"",
            //         avatar_url:"",

            //     }
            // }));
          }}>Create Conversation</Button>
        
           
            
        </form>
    )
}