import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchNotificationThunk } from '../store/notificationSlice';
import { NotificationTypes } from '../utils/types';
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from '../utils/styles';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faXmark } from "@fortawesome/free-solid-svg-icons";
import { fetchAcceptRequestPlay } from '../store/requestSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationComponent = () => {
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

    const dispatch = useDispatch<AppDispatch>();
    const { notification, status, error } = useSelector((state:any) => state.notification);
    useEffect(() => {
        dispatch(fetchNotificationThunk());
      }, [dispatch]);
      const handleAcceptRequestPlay = (requestId: string) => {
        try{
            dispatch(fetchAcceptRequestPlay(requestId));
            ToastSuccess("You are Accepting the request To Play succefully");


        }catch(err : any){
            ToastError("Error while accepting the request to PLay");

        }
      };

      return (
        
        <div className='absolute  rounded-2xl p-3 top-15 right-5 z-50 bg-[#fff] w-[500px] h-[500px] overflow-auto no-scrollbar'>
                     <ToastContainer />

            <div className='  justify-between  py-1 bg-white     items-center gap-1 my-3'>
                <h1 className='text-black text-2xl pl-2 pb-3'>Notification</h1>
                {notification.map(function(elem: NotificationTypes) {
                    return (
                            
                        <div className='bg-[#c5cfdd] p-2 flex items-center my-2 hover:bg-[#F2F3FD] rounded-[20px]' key={elem.id}>
                            <div className='mr-5'>
                            <div className="relative w-16 h-16 rounded-full hover:bg-red-700 bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gray-200 rounded-full border-2 border-white">
                                <Image
                                    src={elem.image_content} // You need to provide a valid source for the Image component
                                    className="h-14 w-14 rounded-[50%] bg-black"
                                    alt="Description of the image"
                                    width={60}
                                    height={60}
                                />
                            </div>
                            
                            </div>
                            </div>
                            <div>
                                <span className="text-black font-mono ">{elem.content}</span>
                                <div>
                                    {(elem.type === 'requestPlay') && (
                                        <div className="absolute right-7 ">
                                            <FontAwesomeIcon icon={faCheck} className=" bg-[#5B8CD3] p-1  rounded-full cursor-pointer  duration-500  hover:text-[--pink-color] " />
                                            <FontAwesomeIcon icon={faTimes} className=" bg-[#5B8CD3] p-1  rounded-full ml-4 cursor-pointer  duration-500  hover:text-[--pink-color] " />
                                        </div>
                                    )}
                                    {(elem.type === 'requestFriend') && (
                                        <div className="absolute right-7 ">
                                            <FontAwesomeIcon icon={faCheck} className=" bg-[#5B8CD3] p-1  rounded-full cursor-pointer  duration-500  hover:text-[--pink-color] " />
                                            <FontAwesomeIcon icon={faTimes} className=" bg-[#5B8CD3] p-1  rounded-full ml-4 cursor-pointer  duration-500  hover:text-[--pink-color] " />
                                        </div>
                                    )}
                                </div>
                            </div>

                            
                      
                            
                        </div>
                        
                    );
                })}
            </div>
        </div>
    );
}

export default NotificationComponent
