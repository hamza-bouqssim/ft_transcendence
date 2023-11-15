import {BiImageAdd} from 'react-icons/bi'

const CreatGroups = () =>{
    return (
        <div className="p-2 mt-10  h-[calc(100%-200px)]  overflow-auto ">

            <label className=" flex items-center justify-center" htmlFor="imagroupe">
                <img src="" alt="" srcset="" />
                <div className="bg-[#EFEFEF] p-10 rounded-full">
                    <BiImageAdd size={30} className="text-[#949494]"></BiImageAdd>
                </div>
            </label>
            <input type="file" id="imagroupe" className="hidden" />
            <div className="flex items-center justify-center">
                <input className="rounded-full  my-10 text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Group Name"></input>
            </div>
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
                <input className="rounded-full w-full  my-10 text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Set a password for your group"></input>
            </div>

            <div className="h-[40%] min-h-[200px] text-black overflow-auto rounded-lg bg-[#D9D9D9]  bg-opacity-20 w-full">
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
        </div>
    )
}
export default CreatGroups;