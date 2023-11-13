import { InputContainer, InputField, InputLabel, TextField } from "@/app/utils/styles"
import styles  from "./index.module.css"
import { Button } from "@/app/utils/styles"
import { useDispatch } from "react-redux"
import { addConversation, createConversationThunk } from "@/app/store/conversationSlice"
import { useForm } from "react-hook-form"
import { CreateConversationParams, createUserParams } from "@/app/utils/types"
import { AppDispatch } from "@/app/store"
import { createConversation } from "@/app/utils/api"
export const CreateConversationForm = () => {
        const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
        const dispatch = useDispatch<AppDispatch>();

        const onSubmit = async  (data : CreateConversationParams) => {
          console.log(data);
          // dispatch(createConversationThunk(data));
          try {
            await createConversation(data);

          }catch(err){
            console.log(err);

          }
        }
    return (
        <form className={styles.formConversation} onSubmit={handleSubmit(onSubmit)}>
          
                <InputContainer backgroundColor="#87a2c6">
                    <InputLabel>Recepient Name</InputLabel>
                    <InputField {...register('display_name', {required: 'display_name is required'})}/>
                    <InputLabel>Message</InputLabel>
                    <TextField {...register('message', {required: 'Message is required'})}/>
                
                </InputContainer>
          <Button >Create Conversation</Button>
        
           
            
        </form>
    )
}