"use client"
import React, { useState,useContext } from 'react';
import { useDispatch } from 'react-redux';
import { createRooms } from  '@/app/store/roomsSlice' // Update with the correct path
import {BiImageAdd} from 'react-icons/bi'
import {FaCheck} from 'react-icons/fa'
import { socketContext } from '@/app/utils/context/socketContext'
import { MemberUser } from '../cardMemberUser/MemberUser';



interface CreateGroupsProps {
    setNewRooms: React.Dispatch<React.SetStateAction<boolean>>;
}


const CreatGroups: React.FC<CreateGroupsProps> = ({ setNewRooms }) => {
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState('');
  const [groupPrivacy, setGroupPrivacy] = useState('Public'); // Default to Public, you can change this based on your logic
  const [groupPassword, setGroupPassword] = useState('');
  const [grouImage,setGroupImage] = useState("")
  const [error , setError] = useState("");
  const { updateChannel,channel} = useContext(socketContext);
  const [idUserAdd,setIdUserAdd] = useState([]);

  console.log(idUserAdd)
  const handleCreateGroup = () => {
        if ((groupPrivacy === "Protected" &&  !groupPassword)) {
          // Handle the case where both groupName and groupPassword are required for Protected groups
          setError("Password are required for a Protected group.");
          return;
        }
        if(!groupName)
        {
            setError("Group Name  are required.");
            return;
        }
        if(!groupPrivacy)
        {
            setError("Group Privacy are required.");
            return;
        }
        
          const newGroupData = {
            name: groupName,
            Privacy: groupPrivacy,
            password: groupPassword,
            picture: null, // Update with the correct path or logic to handle images
          };
      
          dispatch(createRooms(newGroupData)).then(response => {
            // Handle the response here
           setNewRooms(false)
          }).catch(error => {
            console.error('Error creating room:', error);
          });       
  };

    return (
        <div className="p-2 pt-4  h-[calc(100%-150px)]  overflow-auto no-scrollbar ">
            {error && <p  className=" bg-[#EA7F87] rounded-lg p-[10px]  w-full text-center">{error}</p>}
            <label className="mt-5 flex items-center justify-center" htmlFor="imagroupe">
                <img src="" alt="" srcset="" />
                <div className="bg-[#EFEFEF] p-10 rounded-full">
                    <BiImageAdd size={30} className="text-[#949494]"></BiImageAdd>
                </div>
            </label>
            <input type="file" id="imagroupe" className="hidden" />
            <div className="flex items-center justify-center">
                <input  value={groupName}
                        onChange={(e) => setGroupName(e.target.value)} 
                        className="rounded-full  my-5 text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Group Name"></input>
            </div>
            <div className="flex items-center w-[90%] mx-auto justify-between text-black">
                <label>
                    <input
                    type="radio"
                    name="privacyOptions"
                    value="Public"
                    className="mr-2"
                    checked={groupPrivacy === 'Public'}
                    onChange={() => setGroupPrivacy('Public')}
                    />
                    Public
                </label>

                <label>
                    <input
                    type="radio"
                    name="privacyOptions"
                    value="Private"
                    className="mr-2"
                    checked={groupPrivacy === 'Private'}
                    onChange={() => setGroupPrivacy('Private')}
                    />
                    Private
                </label>

                <label>
                    <input
                    type="radio"
                    name="privacyOptions"
                    value="Protected"
                    className="mr-2"
                    checked={groupPrivacy === 'Protected'}
                    onChange={() => setGroupPrivacy('Protected')}
                    />
                    Protected
                </label>
                </div>
            {groupPrivacy ==="Protected" &&
              <div className="flex items-center justify-center mt-5 mx-auto">
                  <input value={groupPassword}
                        onChange={(e) => setGroupPassword(e.target.value)} className="rounded-full w-full   text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Set a password for your group"></input>
              </div>
            }
      <div className="h-[50%] mt-5 min-h-[300px] p-1 text-black rounded-lg  bg-opacity-20 w-full  no-scrollbar">
            <MemberUser idUserAdd={idUserAdd} setIdUserAdd={setIdUserAdd}></MemberUser>
      </div>
            

				<div className="absolute  right-5 bottom-20 md:bottom-4  flex items-center">
					<button onClick={()=>{setNewRooms(false)}} className="text-[#5B8CD3] mr-4">Cancel</button>
					<button onClick={handleCreateGroup} className=" bg-[#5B8CD3] p-4 rounded-full "><FaCheck />
					</button>
				</div>   
        </div>
    )
}
export default CreatGroups;