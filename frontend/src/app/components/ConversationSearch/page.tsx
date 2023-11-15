import styles from "./index.module.scss";
import { MdSearch } from "react-icons/md";

const ConversationSearch = () => {
    return ( 
        <div className="flex mx-auto items-center justify-center w-full mt-10">
            <input className="rounded-l-lg text-black focus:outline-none bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Research/ Lancer une conversation"></input>
            <button className="p-3 w-1/4 rounded-lg ml-[-10px] bg-[#5B8CD3]">Search</button>            
        </div>
     );
}
 
export default ConversationSearch;
