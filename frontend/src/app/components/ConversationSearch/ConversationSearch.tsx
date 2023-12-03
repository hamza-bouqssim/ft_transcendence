import { UsersTypes } from "@/app/utils/types";
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import styles from "./ConversationSearch.module.css"; 
import CreateSearchModal from "./Modal/CreateSearchModal";

const ConversationSearch = () => {

	const [show, setShow] = useState<any>(false);

    return (
        <div className={`search-container ${styles.searchContainer}`}>
            {show &&  <CreateSearchModal   setShow={setShow} />   }

            <input
                className={`rounded-l-lg text-black focus:outline-none bg-[#D9D9D9] bg-opacity-20 p-3 ${styles.input}`}
                placeholder="Find your friends"
                onClick={() => {setShow(!show)}} 
            
            />
            
        </div>
    );
};



export default ConversationSearch;