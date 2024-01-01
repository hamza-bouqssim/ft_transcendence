import { Dispatch, FC, createRef } from "react"
import { MdClose } from "react-icons/md"
import { CreateConversationParams } from "../../utils/types"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createConversationThunk } from "../../store/conversationSlice"

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
			

			dispatch(createConversationThunk(data))
			.then((response: any) => {
				if (!response.payload.success) {
					toast.error(response.payload.message);
				} else {
					toast.success("Create conversation Successfully! 🎉");
				}
			})
			.catch((error: any) => {
				toast.error(error);
			});
           

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
