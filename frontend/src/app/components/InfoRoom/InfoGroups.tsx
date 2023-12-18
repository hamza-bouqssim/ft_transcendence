"use client"
import React ,{useContext,useState} from 'react'
import {MdEdit} from 'react-icons/md'
import { socketContext } from '@/app/utils/context/socketContext'
import { kick } from './kick'
import { Member } from './Member'
import { Ban } from './Ban'
import { Mut } from './Mut'
import { FaChevronDown } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HiOutlineLogout } from "react-icons/hi";
import Button from '../Button/Button'


export const InfoGroups = () => {
  console.log("hi")
  const { updateChannel,channel} = useContext(socketContext);
  const {Userdata} = useContext(socketContext)
  return (
    <div className="p-1  h-full">
        <div className=" p-2 h-full  relative overflow-auto  rounded-xl  text-black  bg-[#E0E3FF] no-scrollbar">
          <div className="">
            <p>Joined Pong Since</p>
            <p>2023-07-12</p>
          </div>
          <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Members</AccordionTrigger>
                <AccordionContent>
                  <Member></Member>
                </AccordionContent>
              </AccordionItem>
              {channel.members.some(member => member.isAdmin && member.user_id === Userdata.id) &&
              
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
            
          <div className=" absolute  mx-auto left-0 right-0 bottom-0">
            { channel.members.some(member => member.isAdmin && member.user_id === Userdata.id) ? null 
                :
                <button className="flex items-center mx-auto  text-[--pink-color] py-4 px-4 rounded-full ">
                  Quitte Rome
                  <HiOutlineLogout size={26}  className="ml-2"></HiOutlineLogout>
                </button>  
            }
          </div>
        </div> 
    </div>
  )
}
