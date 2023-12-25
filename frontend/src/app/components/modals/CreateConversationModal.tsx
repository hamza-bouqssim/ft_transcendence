import { OverlayStyle } from "@/app/utils/styles"
import { CreateConversationForm } from "../forms/CreateConversationForm"
import { ModalContainer, ModalContentBody, ModalHeader } from "."
import { Dispatch, FC, createRef, useEffect } from "react"
import { MdClose } from "react-icons/md"
import { createConversation } from "@/app/utils/api"
import { CreateConversationParams } from "@/app/utils/types"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createConversationThunk } from "@/app/store/conversationSlice"

type props = {
	setShow: Dispatch<React.SetStateAction<Boolean>>;
};

const CreateConversationModal: FC<props> = ({ setShow }) => {
	const ref = createRef<HTMLDivElement>();
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
            const res = await dispatch(createConversationThunk(data));
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


    const handleOverlayClick = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        const { current } = ref;
        if(current === e.target){
        }
    };
   
    return (

        <form className="border border-[--pink-color] py-6 flex flex-col gap-5 justify-center sm:py-5 shadow-[0_0_50px_rgba(0,0,0,.3)] w-full mt-[90px] rounded-2xl h-[55%] p-5" onSubmit={handleSubmit(onSubmit)}>
          <ToastContainer />
				<MdClose  className="relative py-2 cursor-pointer bg-[--blue-color] rounded-full ml-2 -mt-[25px] mb-2" size={35} color="white"  onClick={() => setShow(false)}/>

					<input  {...register('display_name', {required: 'display_name is required'})} type="text" className="rounded-xl h-10 w-full px-5 border border-[--pink-color] border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 " placeholder="Display name" />
			
					<textarea  {...register('message', {required: 'message is required'})} className="resize-none rounded-xl w-full h-[170px] px-5 py-3 no-scrollbar border border-[--pink-color] border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Your message" />
				
				<div className="relative">
					<button  className="bg-[--blue-color] hover:bg-[--pink-color] ease-in-out duration-300 text-white py-2 w-full rounded-xl">Create</button>
				</div>

		

			
			</form >
    )
    
}

export default CreateConversationModal;
