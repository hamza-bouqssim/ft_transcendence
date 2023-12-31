import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "../../utils/styles"
import { ConversationTypes, User, messageTypes } from "../../utils/types";
import { FC, useEffect, useState,useContext ,useRef, useCallback} from "react";
import {  getConversationMessageRoom } from "../../utils/api";
import {socketContext } from "../../utils/context/socketContext";
import Image from  'next/image'
import {usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineLogout } from "react-icons/hi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { AppDispatch } from "@/app/store";
import { joinToRoom,getAllRooms } from "@/app/store/roomsSlice";
import { toast } from "react-toastify";
import MessageInputFieldRoom from "./MessageInputFieldRoom";
import { cleanNotification } from "@/app/store/NotificationChatSlice";



const MessageContainerRoom = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [Message,setMessage] = useState<any[]>([]);
    const [MessageRoom,setMessageRoom] = useState<any[]>([]);
    const pathname = usePathname()
    const { channel , updateChannel} = useContext(socketContext);
    const { oldId,setOldId } = useContext(socketContext);
    const socket  = useContext(socketContext).socket;
    const {Userdata} = useContext(socketContext);
    const { rooms, status, error } = useSelector((state: any) => state.room);
    const [password,satPassword] = useState<string>("")
    const dispatch = useDispatch<AppDispatch>();
    const menuRef = useRef<HTMLDivElement>(null);
    const [valide,setValide] =useState(false)


    const  formatTimeDifference =(timeDifference:number) =>{
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
    
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else{
        return `${minutes} min`;
      } 
    }
    const joinRoom = useCallback(
        (id: string) => {
          if (oldId) socket.emit("leaveToRoom", { id: oldId });
          socket.emit("joinToRoom", { id: id });
          setOldId(id);
        },
        [oldId, socket, setOldId]
      );
    useEffect(() => {
      if(channel){
          const id = channel.id;
            getConversationMessageRoom(id)
              .then((data: any) => {
                joinRoom(id);
                dispatch(cleanNotification({roomId:id}))
                setMessage(data.data.data);
              })
              .catch((err: any) => console.log(err));
        }
    }, [channel?.id]);

    useEffect(() => {
      if (channel?.id) {
        socket.emit("cleanNotification", channel.id);
          return () => {
          socket.off("cleanNotification");
        };
      }
    }, [socket,channel?.id,Message]);
  
    useEffect(()=>{
      scrollRef.current?.scrollIntoView()
    },[Message])

    const handleDocumentClick = (event:any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setValide(false);
      }
  
    };

    const handelJoinRoom = () => {
      if (channel?.id && channel?.Privacy) {
        dispatch(joinToRoom({ id: channel?.id, Privacy: channel?.Privacy, password: password }))
          .then((res: any) => {
            if (res.error) {
              toast.error(res.payload);
            } else {
              toast.success(res.payload);
              dispatch(getAllRooms())
                .then((res:any) => {
                  const foundChannel = res.payload.find((room:ConversationTypes ) => room.id === channel?.id);
                  if (foundChannel) {
                    updateChannel(foundChannel);
                    setValide(false);

                  }
                })
                .catch((error: any) => {
                  toast.error(error);
                });
            }
          })
          .catch((error: any) => {
            toast.error(error);
          });
      }
    };
    
  
    useEffect(() => {
      
        if (valide) {
            document.addEventListener('click', handleDocumentClick);
        } else {
            document.removeEventListener('click', handleDocumentClick);
        }
  
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [valide]);
    return (
        
        <>
            
              {
                  rooms && rooms.some((room :ConversationTypes) => room.id===channel?.id ) ? (
                    <>
                      <div className="h-[calc(100%-148px)] no-scrollbar  overflow-y-auto py-3 ">
                        { Message?.map((m:any) =>(
                          <div className="" key={m.id}>
                              <div className={`${Userdata?.id !== m?.senderId ? " mr-auto justify-start" : "ml-auto justify-end"} my-2    max-w-[70%]  flex  items-start`}>
                                  {
                                    m?.senderId !== Userdata?.id   && <div className="mr-2 mt-1">
                                      <Image src={m?.user.avatar_url} alt="" className=' rounded-full' width={30}
                                                          height={30}/>
                          
                                      </div>
                                  }
                                  <div  className={`${Userdata?.id !== m?.senderId ? "bg-[#F2F3FD] text-[#404040] " : "bg-[#5B8CD3] "} w-fit max-w-[90%] rounded-2xl flex items-end justify-between`}>
                                      <h1 className="p-2"> {m?.content}</h1>
                                      <p className=" pl-5 pr-3 pb-1 text-[12px]">{formatTimeDifference(new Date().getTime() - new Date(m?.createdAt).getTime())}</p>
                                  </div>
                                  
                              </div>
                          </div>
                      ))}
                      <div ref={scrollRef}></div>
                      </div>
                      <MessageInputFieldRoom Message={Message} setMessage={setMessage}/>
                  </>):
                  <div className="w-full flex flex-col items-center justify-center h-[80%]">
                      <Image src={channel?.picture as string} alt="" className=' h-[170px] w-[170px] rounded-full' width={200} height={200}/>
                      <p className='text-[20px] font-blod mt-3 text-center text-black "'>{channel?.name}</p>
                      <p className='text-[15px]  text-center text-gray-400 "'>{channel?.Privacy}</p>
                      <div className="flex items-center justify-center">
                        <Image src={channel?.members[0]?.user?.avatar_url as string} alt="" className=' rounded-full' width={20} height={20}/>
                        <Image src={channel?.members[0]?.user?.avatar_url as string} alt="" className=' ml-[-10px] outline outline-2  outline-white  rounded-full' width={20} height={20}/>
                        <p className='text-[15px] ml-2 text-center text-gray-400 "'>{channel?.members.length} + Member in this Room</p>
                      </div>
                      <button  onClick={()=>{setValide(true)}} className=" flex items-center  mt-8 justify-center rounded-full py-2 px-4 bg-[--pink-color] hover:drop-shadow-md mx-auto mb-3 text-white  ">
                        <h1>Join to Room</h1> 
                        <HiMiniUserGroup size={26}  className="ml-2"></HiMiniUserGroup>
                      </button>  
                    
                  </div>
              }
            

            {valide &&  
      <>
        <div className="fixed left-0 right-0 bottom-0 top-0 bg-[#2e2f54d9]">

        </div>
        <div ref={menuRef} className="fixed left-0 right-0 bottom-0 p-5  z-50 drop-shadow-md top-0 bg-[#ffff] w-[500px] rounded-2xl h-[450px] m-auto">
          <div className="relative h-full flex flex-col items-center justify-center ">
            <Image src={channel?.picture as string} alt="" className=' h-[170px] w-[170px]  rounded-full' width={150} height={150}/>
            <p className='text-[20px] font-blod mt-3 text-center text-black "'>{channel?.name}</p>
            <p className='text-[15px]  text-center text-gray-400 "'>{channel?.Privacy}</p>
            <div className="flex items-center justify-center ">
              <Image src={channel?.members[0]?.user?.avatar_url as string} alt="" className=' rounded-full' width={20} height={20}/>
              <Image src={channel?.members[0]?.user?.avatar_url as string} alt="" className=' ml-[-10px] outline outline-2  outline-white  rounded-full' width={20} height={20}/>
              <p className='text-[15px] ml-2 text-center text-gray-400 "'>{channel?.members.length} + Member in this Room</p>
            </div>
            { channel?.Privacy  === "Protected" && 
                  <input  value={password}
                  onChange={(e) => satPassword(e.target.value)} 
                  className="rounded-full  w-full mt-5 text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" 
                  placeholder="Password">
                  </input>
            }
            <div  className="  flex flex-row mt-5  ">
              <button onClick={()=>{setValide(false)}} className="rounded-full py-2 mr-3 px-4 text-[--pink-color] w-fit  border border-[--pink-color] hover:drop-shadow-md  ">Cancel</button>   
              <button   
                        disabled={channel?.Privacy === 'Protected' && password.length < 8}
                        onClick={handelJoinRoom} className={`${channel?.Privacy  !== "Protected"   
                        ? "bg-[--pink-color] hover:drop-shadow-md" 
                        : password.length < 8 
                        ? "text-[--pink-color] border border-[--pink-color]" 
                        : "bg-[--pink-color] hover:drop-shadow-md" } flex items-center justify-center rounded-full py-2 px-4 `}
              >
              
                Join to Room
                {status === 'loading'   ?   <div className="flex items-center justify-center ml-3">
                  <div
                  className=" text-[white]   h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status">
                  <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span>
                  </div>
                  </div> 
              :   null  
            }
            </button>
            </div>
          </div>
        </div>
      </>
      
    }
               
        </>
    )
}

export default MessageContainerRoom; 