import { OverlayStyle } from "@/app/utils/styles"
import { CreateConversationForm } from "../forms/CreateConversationForm"
import { ModalContainer, ModalContentBody, ModalHeader } from "."
import { Dispatch, FC, createRef, useEffect } from "react"
import { MdClose } from "react-icons/md"
import { createConversation } from "@/app/utils/api"

type props = {
	setShow: Dispatch<React.SetStateAction<Boolean>>;
};

const CreateConversationModal: FC<props> = ({ setShow }) => {
	const ref = createRef<HTMLDivElement>();
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) =>
			e.key === "Escape" && setShow(false);
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
		console.log(ref);
	}, []);

// export const CreateConversationModal:FC<props> = ({setShow}) => {
//     const ref = createRef<HTMLDivElement>();
//     useEffect(() => {
//         const handleKeyDown = (e : KeyboardEvent) => e.key === 'Escape' && setShow(false);
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//         console.log(ref);
//     })

    const handleOverlayClick = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        const { current } = ref;
        if(current === e.target){
            console.log('close Modal');
        }
    };
   
    return (
        <OverlayStyle ref={ref} onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                <h2>Create a conversation</h2>
                <MdClose size={20} color="red"  onClick={() => setShow(false)}/>
                </ModalHeader>
                <ModalContentBody>
                    <CreateConversationForm />
                </ModalContentBody>
               
            </ModalContainer>

        </OverlayStyle>
    )
    
}

export default CreateConversationModal;
