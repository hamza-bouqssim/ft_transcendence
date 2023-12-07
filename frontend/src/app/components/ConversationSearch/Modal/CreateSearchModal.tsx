import { OverlayStyle, OverlayStyleSearching } from "@/app/utils/styles"
import { CreateConversationForm } from "../../forms/CreateConversationForm"
import { Dispatch, FC, createRef, useEffect } from "react"
import { MdClose } from "react-icons/md"
import { createConversation } from "@/app/utils/api"
import { CreateSearchForm } from "../../forms/CreateSearchForm"
import { ModalContainer, ModalContentBody, ModalHeader } from "../../modals"
import { ModalContainerSearching, ModalContentBodySearching, ModalHeaderSearching } from "."

type props = {
   setShow : Dispatch<React.SetStateAction<Boolean>>;
};


const CreateSearchModal:FC<props> = ({setShow}) => {
    const ref = createRef<HTMLDivElement>();
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
   
    return (
        <OverlayStyleSearching ref={ref} onClick={handleOverlayClick}>
            <ModalContainerSearching>
                <ModalHeaderSearching>
                <h2>Searching</h2>
                <MdClose size={20} color="red"  onClick={() => setShow(false)}/>
                </ModalHeaderSearching>
                <ModalContentBodySearching>
                    <CreateSearchForm />
                </ModalContentBodySearching>
               
            </ModalContainerSearching>

        </OverlayStyleSearching>
    )
    
}

export default CreateSearchModal;