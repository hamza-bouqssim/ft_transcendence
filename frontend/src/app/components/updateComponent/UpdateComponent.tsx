"use client"
import React from 'react'
import { MdEdit } from "react-icons/md";

const UpdateComponent = () => {
  return (
    <div className=" h-[calc(100%-100px)] mt-5 overflow-auto">
        <div className="flex items-center justify-center mt-7 ">
          <div className="bg-[#F2F3FD] p-4 rounded-full w-auto mx-auto flex items-center justify-center">
            <img className="bg-cover w-20 h-20  rounded-full" src="https://imgs.search.brave.com/f40nwqJ_6xm73kx2q9wvgGTlt-r9K7UoYevOtjeCAyA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9i/L2I2L0ltYWdlX2Ny/ZWF0ZWRfd2l0aF9h/X21vYmlsZV9waG9u/ZS5wbmc" alt="" srcset="" />
            <div className="ml-2 flex items-center justify-center ">
                <p className="text-black">mohamed jalloul</p>
                <MdEdit className=" ml-2 text-black" size={30}></MdEdit>
            </div>
          </div>
        </div>
        <hr className="my-10 w-1/2 mx-auto" />
        <div className="flex items-center w-[70%] mx-auto justify-between text-black">
                <label>
                    <input type="radio" name="options" value="option1" />
                    Public
                </label>

                <label>
                    <input type="radio" name="options" value="option2" />
                    Private
                </label>

                <label>
                    <input type="radio" name="options" value="option3" />
                    Protected
                    </label>
            </div>
            <div className="flex items-center justify-center w-[80%] mx-auto">
                <input className="rounded-full w-full  my-10 text-black focus:outline-none   bg-[#F2F3FD]   p-3" placeholder="Set a password for your group"></input>
                <button className="bg-[#5B8CD3] ml-[-75px] px-2 py-2 rounded-full  ">change</button>
            </div>

            <div className="h-[40%] rounded-s-xl  min-h-[200px] text-black overflow-auto  bg-[#F2F3FD]   w-full">
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
                <p>sdfsdfsdfds</p>
            </div> 
            <div className="w-full flex items-center justify-center">
              <button className=" rounded-[20px]  bg-[#EA7F87] mt-10 px-10 py-2">Delete</button>
            </div>
    </div>
  )
}

export default UpdateComponent
