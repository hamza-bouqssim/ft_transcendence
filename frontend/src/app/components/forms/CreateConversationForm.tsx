import { InputContainer, InputField, InputLabel, TextField } from "@/app/utils/styles"
import styles  from "./index.module.scss"
import Button from "../Button/Button"
export const CreateConversationForm = () => {

    return (
        <form className={styles.formConversation}>
          
                <InputContainer backgroundColor="#423f5a">
                    <InputLabel>Recepient</InputLabel>
                    <InputField />
                    <InputLabel>Message</InputLabel>
                    <TextField />
                
                </InputContainer>
          <Button>Create Conversation</Button>
        
           
            
        </form>
    )
}