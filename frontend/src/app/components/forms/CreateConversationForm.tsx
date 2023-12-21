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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const CreateConversationForm = () => {
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
        const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
        const dispatch = useDispatch<AppDispatch>();

        const onSubmit = async  (data : CreateConversationParams) => {
          try{
            const res = await dispatch(createConversationThunk(data.display_name));
              if (res.payload && typeof res.payload === 'object') {
                const responseData = res.payload as { data?: { response?: { message?: string } } };
                const message = responseData.data?.response?.message;
                if (message) {
                    ToastSuccess(message);

                }else {
                  const responseData = res.payload as {message?: string};
                  const message = responseData.message;
                  if(message)
                    ToastError(message);
                }
            }
          }catch(err : any){
            ToastError(err.message || "An unexpected error occurred");
          }
        

        }
    return (
      <>
       

        <form className={styles.formConversation} onSubmit={handleSubmit(onSubmit)}>
          
                <InputContainer backgroundColor="#87a2c6">
                    <InputField {...register('display_name', {required: 'display_name is required'})} placeholder="Enter a friend's username"/>
                    
                
                </InputContainer>
          <Button >Create Conversation</Button>
        
           
            
        </form>
        </>
    )
}