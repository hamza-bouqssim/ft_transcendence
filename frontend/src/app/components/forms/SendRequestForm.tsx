import { Conversation, InputContainer, InputField, InputLabel, TextField, StylingForm, ContainerStyling, InputFieldStyling, ButtonStyling } from "@/app/utils/styles"
import styles  from "./index.module.css"
import { useDispatch, useSelector } from "react-redux"
import { addConversation, createConversationThunk } from "@/app/store/conversationSlice"
import { useForm } from "react-hook-form"
import { CreateConversationParams, CreateRequestParams, createUserParams } from "@/app/utils/types"
import { AppDispatch } from "@/app/store"
import { createConversation } from "@/app/utils/api"
import { Dispatch, FC } from "react"
import { fetchRequestThunk } from "@/app/store/requestSlice"



export const SendRequestForm= () => {
        const {register, handleSubmit, formState: { errors }} = useForm<CreateRequestParams>();
        const dispatch = useDispatch<AppDispatch>();
        const { request, status, error } = useSelector((state:any) => state.request);
       console.log("error hererere-->", error);
        const onSubmit = async  (data : CreateRequestParams) => {
          // dispatch(createConversationThunk(data));
          try {
            const response = await dispatch(fetchRequestThunk(data));
            console.log("response hna -->", response);
      
            if (response.payload && response.payload.message) {
              const errorMessage = response.payload.message;
              alert(`Error: ${errorMessage}`);
            } else {
              alert("Friend request sent successfully");
            }
          } catch (err: any) {
            console.error("Error:", err);
            alert(`Error: ${err.message || 'An unexpected error occurred'}!`);
          }
            
           
        }
       
        
    return (

          <StylingForm>
            <h1 className="text-black">Add conversation</h1>
            <form className={styles.formConversation} onSubmit={handleSubmit(onSubmit)}>
              <ContainerStyling>
                <InputFieldStyling {...register('display_name', {required: 'display_name is required'})} placeholder="Add new friends"/>
                <ButtonStyling> Send request </ButtonStyling>

              </ContainerStyling>
                
  
     
      
            </form>
          </StylingForm>
        
    )
}