import { OverlayStyle, OverlayStyleSearching, SearchResultStyling } from "@/app/utils/styles"
import { CreateConversationForm } from "../../forms/CreateConversationForm"
import { Dispatch, FC, createRef, useEffect, useRef, useState } from "react"
import { MdClose } from "react-icons/md"
import { createConversation } from "@/app/utils/api"
import { CreateSearchForm } from "../../forms/CreateSearchForm"
import { ModalContainer, ModalContentBody, ModalHeader } from "../../modals"
import { ModalContainerSearching, ModalContentBodySearching, ModalHeaderSearching } from "."
import { UsersTypes } from "@/app/utils/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"



type props = {
    setShow : Dispatch<React.SetStateAction<Boolean>>;
 };

 const CreateSearchModal:FC<props> = ({setShow}) => {
    const ref = createRef<HTMLDivElement>() ;
    // const [show, setShow] = useState<any>(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UsersTypes[]>([]);
    useEffect(() => {
        const handleKeyDown = (e : KeyboardEvent) => e.key === 'Escape' && setShow(false);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    })


    const handleOverlayClick = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        const { current } = ref;
        if(current === e.target){
            console.log('close Modal');
        }
    };
    useEffect(() => {
        // Define a function to fetch search results
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/search`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ displayName: searchQuery }),
                });

                 
                if (response.ok) 
                {
                    const data = await response.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        if (searchQuery.trim() !== "") {
            fetchSearchResults();
        } else {
            setSearchResults([]);
        }

    }, [searchQuery]);

    const devRef : HTMLDivElement = useRef
   
    return (

        <div className="bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] rounded-3xl flex gap-1 flex-col items-center py-5 z-10 fixed top-[50%] px-[1%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[600px] aspect-[3/2]">
            <div>
                <MdClose size={30} color="white"  onClick={() => setShow(false)}/>
            </div>
            <input  placeholder="Find your friends" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}type="text" className="w-[99%] h-[80px] text-black px-4  text-2xl" />
            <div className="bg-red-200 w-full relative rounded-2xl ">
            <div className=" py-10 rounded-2xl  w-full flex flex-col gap-1 overflow-auto" >
                            {searchResults.map((user) => (
                        //<div key={user.id} ref={devRef} className=" text-[--pink-color] text-xl font-['Whitney_Semibold'] p-2 hover:bg-[rgba(255,255,255,0.4)] cursor-pointer" onMouseMove={() => setTopValue()} >
                        <div  key={user.id}>
                            {user.display_name}
                       
                        </div>
                ))}
            </div >
                <FontAwesomeIcon icon={faArrowRight} className={`absolute z-10  -left-[65px] text-[--pink-color] text-3xl font-bold `} />
                <FontAwesomeIcon icon={faArrowLeft} className="absolute z-10 -right-[65px] text-3xl font-bold text-[--pink-color]" />
            </div>
        </div>
    )
    
}

export default CreateSearchModal;