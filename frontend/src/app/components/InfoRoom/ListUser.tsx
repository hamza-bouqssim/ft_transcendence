import React ,{useContext,useState,useEffect,useRef} from 'react'
import { MdOutlineMoreVert } from "react-icons/md";
import Image from 'next/image';
import { FaBan } from "react-icons/fa";
import { BsFillMicMuteFill } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";
import { socketContext } from '../../utils/context/socketContext';
import { useDispatch, useSelector } from 'react-redux';
import { TiUserDelete } from "react-icons/ti";
import { banMembers, getAllMembers, kickMembers, makeAdminMember, makeMember, mutMembers } from '../../store/memberSlice';
import { AppDispatch } from '../../store';

interface Member {
  id: string;
  user_id: string;
  chatRoomId: string;
  isAdmin: boolean;
  Status: string;
  user: {
    id: string;
    username: string;
    status: string;
    email: string;
    password: string;
    display_name: string;
    avatar_url: string;
    two_factor_auth: string;
    two_factor_secret_key: string;
  };
}

interface Props {
  member:Member
  }
const ListUser: React.FC<Props> = ({member}) => {
  const [option, setOption] = useState(false)
  const { members,status,error} = useSelector((state:any) => state.member);
  const {Userdata} = useContext(socketContext)
  const [valide,setValide] =useState<string| null>(null)
  const { updateChannel,channel} = useContext(socketContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch =useDispatch<AppDispatch>();
  const optionRef = useRef<HTMLDivElement>(null);
  const [muteDuration, setMuteDuration] = useState<string>("5");



  const handleDocumentClick = (event:any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setValide(null);
    }
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setOption(false);
    }
  };

  useEffect(() => {
    
      if (valide) {
          document.addEventListener('click', handleDocumentClick);
      } else {
          document.removeEventListener('click', handleDocumentClick);
      }
      if (option) {
        document.addEventListener('click', handleDocumentClick);
    } else {
        document.removeEventListener('click', handleDocumentClick);
    }

      return () => {
          document.removeEventListener('click', handleDocumentClick);
      };
  }, [valide,option]);

  const handelEvent = (valideData:string) =>
  {
    if(valideData ==="Ban")
    {
      if(member?.user.id && channel?.id)
      {
        dispatch(banMembers({
          userId:member?.user.id ,
          id:channel?.id,
        })).then((res:any)=>{
          dispatch(getAllMembers(channel.id))
           setValide(null)
        })
      }
    }
    if(valideData ==="Mut")
    {
      if(member?.user.id && channel?.id)
      {
        dispatch(mutMembers({
          userId:member?.user.id,
          id:channel?.id,
          muteDuration:muteDuration
        })).then((res:any)=>{
          dispatch(getAllMembers(channel.id))
          setValide(null)
        })
      }
    }
    if(valideData ==="Kick")
    {
      if(member?.user.id && channel?.id)
      {
        dispatch(kickMembers({
          userId:member?.user.id,
          id:channel?.id
        })).then((res:any)=>{
          dispatch(getAllMembers(channel.id))
          setValide(null)

        })
      }
    }
    if(valideData ==="Member")
    {
      if(member?.user.id && channel?.id)
      {
        dispatch(makeMember({
          userId:member?.user.id,
          id:channel?.id
        })).then((res:any)=>{
          dispatch(getAllMembers(channel.id))
          setValide(null)
        })
      }
    }
    if(valideData ==="Admin")
    {
      if(member?.user.id && channel?.id)
      {
        dispatch(makeAdminMember({
          userId:member?.user.id,
          id:channel?.id
        })).then((res:any)=>{
          dispatch(getAllMembers(channel.id))
          setValide(null)
        })
      }
    }
   


  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMuteDuration(event.target.value);
  };
  
  


  return (
    <>
      <div className="">
        <div  className="flex items-center justify-between relative">
              <div className="flex items-center m-1">
              <div className={`${member?.Status === "Owner" ? "outline outline-4 outline-[--pink-color]" : ""} rounded-full`}>
                  <Image src={member?.user.avatar_url} alt="" className="w-10 rounded-full" width={30} height={30}/>
                </div>
                <div className="text-[13px] flex flex-col justify-center ml-2">
                  <h1>{member?.user.username}</h1>
                  <h1>{member?.Status}</h1>
                </div>
              </div>
              {members?.some((member:Member) =>( member.Status === "Admin") && member.user_id === Userdata?.id) 
              && member?.Status !== "Admin"  
              && <MdOutlineMoreVert onClick={()=>{setOption(!option)}} size={25} />} 
               {members?.some((member:Member) =>( member.Status === "Owner") && member.user_id === Userdata?.id) 
              && member?.Status !== "Owner"  
              && <MdOutlineMoreVert onClick={()=>{setOption(!option)}} size={25} />} 
     
        </div>
          {option  && members?.some((member:Member) => (member.Status === "Owner" || member.Status === "Admin")  && member.user_id === Userdata?.id) && 
          <div ref={optionRef}  className="absolute z-50 p-2 rounded-xl right-1 flex flex-col  justify-between items-start    w-[150px] h-[150px] bg-white drop-shadow-md">
           {member?.Status!== "Mut" &&  
              <button onClick={()=>{setValide("Mut")}} className="text-[15px] p-1 flex justify-center items-center">
                 <BsFillMicMuteFill  className="mr-2"></BsFillMicMuteFill>
                  Mut User
              </button>
            }
            {member?.Status!== "Ban" &&  
               <button onClick={()=>{setValide("Ban")}} className="text-[15px] p-1 flex justify-center items-center">
               <FaBan  className="mr-2"></FaBan>
               Ban User</button>
            }
            {member?.Status!== "Member" &&  
              <button  onClick={()=>{setValide("Member")}} className="text-[15px] p-1 flex justify-center items-center">
              <MdGroupAdd  className="mr-2"></MdGroupAdd>
              Make Member</button>
            }
            {member?.Status!== "Admin" && member?.Status !== "Owner" &&
              <button  onClick={()=>{setValide("Admin")}} className="text-[15px] p-1 flex justify-center items-center">
              <RiAdminLine className="mr-2"></RiAdminLine>
              Make Admin</button>
            }
          
              <button  onClick={()=>{setValide("Kick")}} className="text-[15px] p-1 flex justify-center items-center">
              <TiUserDelete className="mr-2"></TiUserDelete>
              Kick User</button>
            
          </div>
          }
      </div>
      {valide &&  
                <>
                  <div className="fixed z-50 left-0 right-0 bottom-0 top-0 bg-[#2e2f54d9]"></div>
                  <div ref={menuRef} className="fixed left-0 right-0 bottom-0 p-5 z-50 drop-shadow-md top-0 bg-[#ffff] w-[500px] rounded-2xl h-[300px] m-auto">
                    <div className="relative h-full">
                    {
                          valide === "Mut" ? (
                            <>
                              <p className="text-[17px] pt-5 pl-5 text-black">Mut {member?.user.username} {channel?.name}</p>
                              <p className="mt-2 text-black pl-5">Some Mut related message</p>
        
                              <div className='w-full flex flex-col mt-10 items-center justify-center'>
                                <p className=" text-black">Deree in sec</p>
                                 <input  value={muteDuration} onChange={(event)=>{setMuteDuration(event.target.value)}} type="number"   className="  rounded-full bg-[#D9D9D9] bg-opacity-20   p-3 text-black  focus:outline-none mx-auto  text-lg w-[50%]"></input>
                              </div>
                            </>
                          ) : valide === "Ban" ? (
                            <>
                              <p className="text-[17px] pt-5 pl-5 text-black">Ban {member?.user.username} {channel?.name}</p>
                              <p className="mt-2 text-black pl-5">Some Ban related message</p>
                            </>
                          ) : valide === "Member" ? (
                            <>
                              <p className="text-[17px] pt-5 pl-5 text-black">Make {member?.user.username} Member {channel?.name}</p>
                              <p className="mt-2 text-black pl-5">Some Member related message</p>
                            </>
                          ) : valide === "Admin" ? (
                            <>
                              <p className="text-[17px] pt-5 pl-5 text-black">Make {member?.user.username} Admin {channel?.name}</p>
                              <p className="mt-2 text-black pl-5">Some Admin related message</p>
                            </>
                          ) 
                          : valide === "Kick" ? (
                            <>
                              <p className="text-[20px] pt-5 pl-5 text-black">Kick {member?.user.username}  {channel?.name}</p>
                              <p className="mt-2 text-black pl-5">Some Kick related message</p>
                            </>
                          ) : null
                      }

                      <div className="absolute right-0 bottom-0 flex flex-col items-end">
                        <button onClick={() => { setValide(null) }} className="rounded-full py-2 px-4 text-[--pink-color] mb-4 w-fit border border-[--pink-color] hover:drop-shadow-md">Cancel</button>
                        <button onClick={()=>handelEvent(valide)} className="flex text-white items-center justify-center rounded-full py-2 px-4 bg-[--pink-color] hover:drop-shadow-md">
                          {
                            valide === "Mut" ? <div className="text-[17px]">Mut {member?.user.username}</div> :
                            valide === "Ban" ? <div className="text-[17px]">Ban {member?.user.username}</div> :
                            valide === "Member" ? <div className="text-[17px]">Make {member?.user.username} Member</div> :
                            valide === "Kick" ? <div className="text-[17px]">Kick {member?.user.username}</div> :
                            valide === "Admin" ? <div className="text-[17px]">Make {member?.user.username} Admin</div> : null
                          }
                          {status === 'loading' ? <div className="flex items-center justify-center ml-3">
                            <div
                              className="text-[white] h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                              role="status">
                              <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                              >Loading...</span>
                            </div>
                          </div> : null
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              }
    </>
  );
};

export default ListUser;
