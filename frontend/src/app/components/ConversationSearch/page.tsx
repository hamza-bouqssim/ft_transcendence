"use client"
import { UsersTypes } from "@/app/utils/types";
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import styles from "./ConversationSearch.module.css"; 
import CreateSearchModal from "./Modal/CreateSearchModal";

const ConversationSearch = () => {
  

	const [show, setShow] = useState<any>(false);
    
    return (
        <div className={`search-container ${styles.searchContainer}`}>
<<<<<<< HEAD
            {show &&  
            <>
            <div className=" opacity-100 bg-[#ffffff93] absolute z-10 left-0 right-0 bottom-0  top-0">

            </div>
                <CreateSearchModal  setShow={setShow}/>   
            </>}

=======
            {/* {show &&  <CreateSearchModal   setShow={setShow} />   } */}
>>>>>>> 457a9c58d013db8f775f87b608be651d3cc9c772
            <input
                className={`rounded-l-lg text-black focus:outline-none bg-[#D9D9D9] bg-opacity-20 p-3 ${styles.input}`}
                placeholder="Find your friends"
                onClick={() => {setShow(!show)}}
            />
            
        </div>
    );
};



export default ConversationSearch;