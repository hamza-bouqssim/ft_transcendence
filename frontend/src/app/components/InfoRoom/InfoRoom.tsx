"use client"
import React, {useContext} from 'react'
import { usePathname } from 'next/navigation'
import { InfoGroups } from './InfoGroups'
import { InfoChat } from './InfoChat'
export const InfoRoom = () => {
    const pathname = usePathname()
  
  return (
    <div  className="bg-[#F2F3FD] w-full h-full rounded-2xl ">
        {pathname.includes("groups") ? <InfoGroups/> : <InfoChat/> }
    </div>
  )
}
