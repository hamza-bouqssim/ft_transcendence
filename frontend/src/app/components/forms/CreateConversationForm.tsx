import { InputContainer, InputField, InputLabel, TextField } from "@/app/utils/styles"
import styles  from "./index.module.css"
import { Button } from "@/app/utils/styles"
import { useDispatch } from "react-redux"
import { addConversation, createConversationThunk } from "@/app/store/conversationSlice"
import { useForm } from "react-hook-form"
import { CreateConversationParams, createUserParams } from "@/app/utils/types"
import { AppDispatch } from "@/app/store"
import { createConversation } from "@/app/utils/api"
import { Dispatch, FC } from "react"

// type Props = {
  
//     setShow : Dispatch<React.SetStateAction<Boolean>>;


// }

export const CreateConversationForm = () => {
        const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
        const dispatch = useDispatch<AppDispatch>();

        const onSubmit = async  (data : CreateConversationParams) => {
          // dispatch(createConversationThunk(data));
        
            dispatch(createConversationThunk(data)).then(()=>{
              alert("You are adding new conversation")
            }).catch((err)=>{
             console.log(err); 
            })


        }
    return (
        <form className={styles.formConversation} onSubmit={handleSubmit(onSubmit)}>
          
                <InputContainer backgroundColor="#87a2c6">
                    <InputField {...register('display_name', {required: 'display_name is required'})} placeholder="Enter a friend's username"/>
                    
                
                </InputContainer>
          <Button >Create Conversation</Button>
        
           
            
        </form>
    )
}