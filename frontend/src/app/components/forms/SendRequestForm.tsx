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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SendRequestForm= () => {
  const ToastError = (message: any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
	
	  const ToastSuccess = (message: any) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };

        const {register, handleSubmit, formState: { errors }} = useForm<CreateRequestParams>();
        const dispatch = useDispatch<AppDispatch>();
        const { request, status, error } = useSelector((state:any) => state.request);
        const onSubmit = async  (data : CreateRequestParams) => {
          try {
            const response = await dispatch(fetchRequestThunk(data));
      
            if (response.payload && response.payload.message) {
              const errorMessage = response.payload.message;
              ToastError(`Error: ${errorMessage}`);
            } else {
              ToastSuccess("Friend request sent successfully");

            }
          } catch (err: any) {
            ToastError(`Error: ${err.message || 'An unexpected error occurred'}!`);

          }
            
           
        }
       
        
    return (

          <StylingForm>
            	<ToastContainer />
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