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
            console.log('close Modal');
        }
    };
   
    return (

        <form className=" py-6 flex flex-col justify-center sm:py-12" onSubmit={handleSubmit(onSubmit)}>

			<div className="relative py-3 sm:max-w-xl sm:mx-auto">
				<div
					className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">

				</div>
				<MdClose  className="relative py-2 cursor-pointer" size={40} color="red"  onClick={() => setShow(false)}/>

			<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

				<div className="max-w-md mx-auto">
					<div>

						<h1 className="text-xl font-semibold text-black">Create a conversation</h1>
					</div>
					<div className="divide-y divide-gray-200">
					<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
						<div className="relative">
							<input  {...register('display_name', {required: 'display_name is required'})} type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
							<label  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Display Name</label>
						</div>
						<div className="relative">
							<input {...register('message', {required: 'message is required'})} type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
							<label  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Message</label>
						</div>
						<div className="relative">
							<button  className="bg-blue-500 text-white rounded-md px-2 py-1">Create</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</form >
    )
    
}

export default CreateConversationModal;
