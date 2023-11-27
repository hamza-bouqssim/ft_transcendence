import styles from "./index.module.scss";
import { MdSearch } from "react-icons/md";

const ConversationSearch = () => {
    return ( 
        <div className="flex mx-auto items-center justify-center w-full mt-10">
            <input className="rounded-full text-black focus:outline-none bg-[#D9D9D9] w-full  bg-opacity-20  p-3" placeholder="search & Lancer une conversation"></input>
        </div>
     );
}
 
export default ConversationSearch;
