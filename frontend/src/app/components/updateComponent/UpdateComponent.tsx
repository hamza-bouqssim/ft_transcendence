"use client"
import React from 'react'
import { MdEdit } from "react-icons/md";
import { useContext, useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import EdiText from 'react-editext'
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import {socketContext } from "@/app/utils/context/socketContext";
import { deleteRooms, updateRooms } from  '@/app/store/roomsSlice' // Update with the correct path
import { RestFriend } from '../RestFriend/RestFriend';
interface Room {
  id: string;
  name: string;
  Privacy: string;
  password?:string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  members: {
    isAdmin: boolean;
  };
}

const UpdateComponent = () => {
  const { updateChannel, channel } = useContext(socketContext);
  const dispatch = useDispatch();
  const [olddata, setOldData] = useState<Room | null>(null);
  const [password,setPassword] = useState<string |null>(null)
  useEffect(() => {
    if (channel) {
      setOldData(channel);
    }
  }, [channel]);
  const handleDeleteGroup = () => {

      dispatch(deleteRooms(channel.id)).then(response => {
        updateChannel(null)
      }).catch(error => {
        console.error('Error creating room:', error);
      });       
};
const handleUpdate = () => {

  dispatch(updateRooms(olddata)).then(response => {
    updateChannel(response.meta.arg)
  }).catch(error => {
    console.error('Error creating room:', error);
  });       
};


  return (
    <div className=" h-[calc(100%-90px)] mt-5 overflow-auto no-scrollbar  relative">
        <div className="flex items-center justify-center mt-7 ">
          <div className="bg-[#F2F3FD] p-4 rounded-full  w-auto mx-auto flex items-center justify-center">
            <img className="bg-cover w-20 h-20  rounded-full" src={olddata?.picture} alt="" srcset="" />
            <div className="mx-2 flex items-center justify-center ">
            <EdiText
              saveButtonContent={<FaCheck />}
              cancelButtonContent={<IoClose />}
              saveButtonClassName=" bg-[#5B8CD3]  text-white p-2 py-1 rounded-full mr-2"
              cancelButtonClassName="bg-[#EA7F87] text-white p-2 rounded-full"
              editButtonClassName="bg-[#5B8CD3] text-white p-2  rounded-full"
              editButtonContent={<MdEdit />}
              type='text'
              value={olddata?.name}
              className="text-black"
              onSave={(val:string) => {
                setOldData((prevData:any) => {
                  if (prevData) {
                    return { ...prevData, name : val };
                  }
                  return null; // or handle the case where prevData is null
                });
              }}
              inputProps={{
                style: {
                  backgroundColor: '#F2F3FD',
                  border:"none"
                },
              }}

            />
            </div>
          </div>
        </div>
        <hr className="my-10  w-1/2 mx-auto" />
        <div className="flex items-center w-[90%] my-8 mx-auto justify-between text-black ">
                <label>
                <input
                    type="radio"
                    name="update"
                    value="Public"
                    className="mr-2"
                    checked={olddata?.Privacy === 'Public'}
                    onChange={() => {
                      setOldData((prevData) => {
                        if (prevData) {
                          return { ...prevData, Privacy: 'Public' };
                        }
                        return null; // or handle the case where prevData is null
                      });
                    }}
                  />
                    Public
                </label>

                <label>
                <input
                    type="radio"
                    name="update"
                    value="Public"
                    className="mr-2"
                    checked={olddata?.Privacy === 'Private'}
                    onChange={() => {
                      setOldData((prevData) => {
                        if (prevData) {
                          return { ...prevData, Privacy: 'Private' };
                        }
                        return null; // or handle the case where prevData is null
                      });
                    }}
                  />
                    Private
                </label>

                <label>
                  <input
                    type="radio"
                    name="update"
                    value="Public"
                    className="mr-2"
                    checked={olddata?.Privacy === 'Protected'}
                    onChange={() => {
                      setOldData((prevData) => {
                        if (prevData) {
                          return { ...prevData, Privacy: 'Protected' };
                        }
                        return null; // or handle the case where prevData is null
                      });
                    }}
                  />
                    Protected
                </label>
                </div>
            {
              olddata?.Privacy === 'Protected' &&
                <div className="flex items-center justify-center w-[80%] mx-auto">
                    <input onChange={(e) => {setPassword(e.target.value)}} className="rounded-full w-full  my-5 text-black focus:outline-none   bg-[#F2F3FD]   p-3" placeholder="Set a password for your group"></input>
                  <button  
                    onClick={() => {
                      setOldData((prevData) => {
                        if (prevData) {
                          return { ...prevData, password: password };
                        }
                        return null; // or handle the case where prevData is null
                      });
                    }}
                  
                  className={`${_.isEqual(olddata.password, password) ? "hidden" : "block" } bg-[#5B8CD3] ml-[-75px] px-2 py-2 rounded-full`}>change</button>
                </div>
            }
            

            <div className="h-[40%] rounded-xl  mt-5 min-h-[200px] text-black overflow-auto  bg-[#F2F3FD] no-scrollbar   w-full">
               <RestFriend></RestFriend>
            </div> 
            <div className=" absolute right-0 bottom-20 md:bottom-5 flex items-center justify-center">
              <button  onClick={handleUpdate} className={`${_.isEqual(olddata, channel) ? " hidden " :"block "}rounded-[10px]  bg-[#EA7F87] mt-5 px-5 py-2`}>update</button>
              <button onClick={handleDeleteGroup} className=" rounded-[10px]  bg-[#EA7F87] mt-5 ml-3 px-5 py-2">Delete</button>
            </div>
    </div>
  )
}

export default UpdateComponent
