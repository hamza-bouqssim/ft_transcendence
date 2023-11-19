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

type Props = {
  
  setShow: Dispatch<React.SetStateAction<boolean>> 

}

export const CreateConversationForm: FC<Props> = ({setShow}) => {
        const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
        const dispatch = useDispatch<AppDispatch>();

        const onSubmit = async  (data : CreateConversationParams) => {
          console.log(data);
          // dispatch(createConversationThunk(data));
        
            dispatch(createConversationThunk(data)).then(()=>{
              console.log("done");
              setShow(false);
            }).catch((err)=>{
             console.log(err); 
            })


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