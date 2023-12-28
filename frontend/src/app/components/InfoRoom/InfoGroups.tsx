"use client"
import React ,{useContext,useState,useRef,useEffect} from 'react'
import {MdEdit} from 'react-icons/md'
import { socketContext } from '../../utils/context/socketContext'
import { Member } from './Member'
import { Ban } from './Ban'
import { Mut } from './Mut'
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronDown } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HiOutlineLogout } from "react-icons/hi";
import Button from '../Button/Button'
import { quitMember } from '../../store/memberSlice'
import { getAllRooms } from '../../store/roomsSlice'
import { Owner } from './Owner'
import { Admin } from './Admin'
import { AppDispatch } from '../../store'

interface Members {
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

export const InfoGroups = () => {
  const { updateChannel,channel} = useContext(socketContext);
  const {Userdata} = useContext(socketContext)
  const dispatch = useDispatch<AppDispatch>();
  const { members,status,error} = useSelector((state:any) => state.member);
  const [valide,setValide] =useState(false)

  const handelQuitRoom=()=>
  {
    if(channel?.id)
    {
        dispatch(quitMember(channel?.id)).then((res:any)=>{
          updateChannel(null)
          dispatch(getAllRooms())
        })
    }
  }
  
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleDocumentClick = (event:any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setValide(false);
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
      <div className="p-1  h-full  ">
          <div className=" p-2 h-full  relative overflow-auto  rounded-xl  text-black  bg-[#E0E3FF] no-scrollbar">
            <div className="">
              <p>Joined Pong Since</p>
              <p>2023-07-12</p>
            </div>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Owner</AccordionTrigger>
                  <AccordionContent>
                    <Owner></Owner>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem  value="item-4">
                  <AccordionTrigger>Admin</AccordionTrigger>
                  <AccordionContent>
                    <Admin></Admin>
                  </AccordionContent>
                </AccordionItem>  
                <AccordionItem value="item-1">
                  <AccordionTrigger>Members</AccordionTrigger>
                  <AccordionContent>
                    <Member></Member>
                  </AccordionContent>
                </AccordionItem>
                {members?.some((member:Members) => (member.Status === "Owner"  || member.Status === "Admin" )&& member.user_id === Userdata?.id) &&
                
              <>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Ban</AccordionTrigger>
                  <AccordionContent>
                    <Ban></Ban>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Mut</AccordionTrigger>
                  <AccordionContent>
                    <Mut></Mut>
                  </AccordionContent>
                </AccordionItem>
              </>
            }
              </Accordion>
              
            <div className=" absolute z-0 mx-auto left-0 right-0 bottom-0">
              {  members?.some((member:Members) => member.Status !== "Ban" && member.user_id === Userdata?.id) &&
                <button onClick={()=>{setValide(true)}}  className=" flex items-center justify-center rounded-full py-2 px-4 bg-[--pink-color] hover:drop-shadow-md mx-auto mb-3 text-white  ">
                  <h1>Quitte Rome</h1> 
                    <HiOutlineLogout size={26}  className="ml-2"></HiOutlineLogout>
                  </button>  
              }
            </div>
          </div> 
      </div>
      {valide &&  
      <>
        <div className="fixed left-0 right-0 bottom-0 top-0 bg-[#2e2f54d9]">

        </div>
        <div ref={menuRef} className="fixed left-0 right-0 bottom-0 p-5  z-50 drop-shadow-md top-0 bg-[#ffff] w-[500px] rounded-2xl h-[300px] m-auto">
          <div className="relative h-full ">
            <p className="text-[20px] pt-5 pl-5 text-black">Quitter le groupe  {channel?.name}</p>
            <p className="mt-2 text-black  pl-5" > Seulement les admins du groupe sauront que vous avez quitté le groupe.</p>
            <div  className="absolute right-0 bottom-0  flex flex-col  items-end">
              <button onClick={()=>{setValide(false)}} className="rounded-full py-2 px-4 text-[--pink-color] mb-4 w-fit  border border-[--pink-color] hover:drop-shadow-md  ">Cancel</button>   
              <button onClick={handelQuitRoom} className=" flex items-center justify-center rounded-full py-2 px-4 bg-[--pink-color] hover:drop-shadow-md  ">
              
                Quitter le groupe
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
