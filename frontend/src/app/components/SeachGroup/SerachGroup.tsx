import React, {useState,useEffect} from 'react'

export const SerachGroup = () => {
    const[groupName,setGroupName]= useState("")
    
  return (
    <div>
        <input  value={groupName}
                onChange={(e) => setGroupName(e.target.value)} 
                className="rounded-full  w-full my-5 text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" 
                placeholder="Group Name">
        </input>
        <div>

        </div>
    </div>
  )
}
