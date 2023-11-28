import { Conversation, InputContainer, InputField, InputLabel, TextField, StylingForm, ContainerStyling, InputFieldStyling, ButtonStyling } from "@/app/utils/styles"
import styles  from "./index.module.css"
import { useDispatch } from "react-redux"
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

        const onSubmit = async (data: CreateRequestParams) => {
          try {
              const res = await dispatch(fetchRequestThunk(data));
              console.log("respose here", res);
              if (res.payload && typeof res.payload === 'object') {
                const responseData = res.payload as { data?: { response?: { message?: string } } };
                const message = responseData.data?.response?.message;
    
                if (message) {
                    alert(message);
                }else {
                  const responseData = res.payload as {message?: string};
                  const message = responseData.message;
                  if(message)
                    alert(message);
                }
            }
          } catch (err : any) {
            console.error("the error here--->", err);
            alert(err.message || "An unexpected error occurred");
          }
      };
        
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