import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchNotificationThunk, fetchdeleteNotification } from '../store/notificationSlice';
import { NotificationTypes } from '../utils/types';
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from '../utils/styles';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faXmark } from "@fortawesome/free-solid-svg-icons";
import { fetchAcceptFriendRequestThunk, fetchAcceptRequestPlay, fetchREfuseFriendRquestThunk, fetchRefuseRequestPlay } from '../store/requestSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from 'https';

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
      const handleClickAcceptRequest = async (id : string) => {
        try {
         
          await dispatch(fetchAcceptFriendRequestThunk(id));
          ToastSuccess("You are accepting the request !");

        } catch (error) {
          ToastError(`Error accepting friend request: ${error}`);

        }
      };

      const handleClickRefuseRequest = async (id : string) =>{
        try{
          await dispatch(fetchREfuseFriendRquestThunk(id));
          ToastSuccess("You are refusing the request");


        }catch(error){
          ToastError(`Error refusing friend request, ${error}`);
        }
      }

      const handleClickAcceptPLay = async (id : string) =>{
        try {
         
            await dispatch(fetchAcceptRequestPlay(id));
            ToastSuccess("You are accepting the request to play!");
  
          } catch (error) {
            ToastError(`Error accepting friend request to play: ${error}`);
  
          }
      }

      const handleClickRefusePLay = async (id : string) =>{
        try {
         
            await dispatch(fetchRefuseRequestPlay(id));
            ToastSuccess("You are refusing the request to play !");
  
          } catch (error) {
            ToastError(`Error refusing friend request to play: ${error}`);
  
          }
      }

      const deleteNotification = async (id : string) =>{
        try{
            await dispatch(fetchdeleteNotification(id));
            ToastSuccess("delete notification Succefully !");


        }catch(error){
          ToastError(`Error while deleting Succefully !`);


        }
      }
      return (
        
        <div className='absolute  rounded-2xl p-3 pt-12 top-15 right-5 border-white border-2 z-50 bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] w-[500px] h-[500px] overflow-auto no-scrollbar'>
                      

            <div className='  justify-between  py-1 items-center gap-1 my-3'>
                <h1 className='text-white text-2xl -ml-[12px] pl-4 flex items-center py-3 bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] fixed z-10 w-[497px] -mt-[64px]  rounded-t-2xl'>Notifications</h1>
                {notification.map(function(elem: NotificationTypes) {
                    return (
                            
                        <div className=' px-2 flex items-center gap-3 my-2 hover:bg-[#6967f36c] border border-[--pink-color] py-2 rounded-[20px]' key={elem.id}>
                            {/* <div className='bg-yellow-200'> */}
                            <div className="relative w-16 h-16 rounded-full hover:bg-red-700 bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gray-200 rounded-full border-2 border-white">
                                        <Image
                                            src={elem.image_content as string} // You need to provide a valid source for the Image component
                                            className="h-14 w-14 rounded-[50%] bg-black"
                                            alt="Description of the image"
                                            width={60}
                                            height={60}
                                        />
                                    </div>
                            </div>
                            <span className="text-white font-mono w-[58%] inline-block">{elem.content}</span>
                            <div className='relative flex items-center justify-center w-[70px] h-[60px]'>
                                {(elem.type == 'requestPLay') && (
                                    <div className="absolute flex gap-3">
                                        <FontAwesomeIcon icon={faCheck} className=" bg-[#5B8CD3] w-4 h-4 p-1 rounded-full cursor-pointer  duration-500  hover:text-[--pink-color] " onClick={()=> handleClickAcceptPLay(elem.requestId) }/>
                                        <FontAwesomeIcon icon={faTimes} className=" bg-[#5B8CD3] w-4 h-4 p-1  rounded-full cursor-pointer  duration-500  hover:text-[--pink-color] " onClick={()=> handleClickRefusePLay(elem.requestId)}/>
                                    </div>)
                                 }
                                {(elem.type === 'requestFriend') && (
                                    <div className="absolute flex gap-3">
                                        <FontAwesomeIcon icon={faCheck} className=" bg-[#5B8CD3] w-4 h-4 p-1 rounded-full cursor-pointer  duration-500  hover:text-[--pink-color] " onClick={()=> handleClickAcceptRequest(elem.requestId)}/>
                                        <FontAwesomeIcon icon={faTimes} className=" bg-[#5B8CD3] w-4 h-4 p-1  rounded-full cursor-pointer  duration-500  hover:text-[--pink-color] " onClick={()=>handleClickRefuseRequest(elem.requestId)}/>
                                    </div>
                                )}
                            </div>
                            <FontAwesomeIcon icon={faTimes} className="text-[--pink-color] font-bold hover:scale-150 w-4 h-4 p-1 mt-[8px] mb-auto rounded-full cursor-pointer  duration-500  hover:text-[--purple-color] " onClick={() => deleteNotification(elem.id)}/>
                        </div>
                        
                    );
                })}
            </div>
        </div>
    );
}

export default NotificationComponent
