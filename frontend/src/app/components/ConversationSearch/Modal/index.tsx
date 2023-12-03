import { ModalContainerSearchingStyle, ModalContainerStyle, ModalContentBodySearchingStyle, ModalContentBodyStyle, ModalHeadersSearchingStyle, ModalHeadersStyle } from "@/app/utils/styles";
import { FC, PropsWithChildren } from "react";

export const ModalHeaderSearching : FC<PropsWithChildren> = ({ children }) => {
    return (
      
        <ModalHeadersSearchingStyle>{children}</ModalHeadersSearchingStyle>
        
   
    )
}

export const ModalContentBodySearching: FC<PropsWithChildren> = ({
    children
}) => {
    return (
    <ModalContentBodySearchingStyle>
            {children}
    </ModalContentBodySearchingStyle>)
}


export const ModalContainerSearching : FC<PropsWithChildren> = ({
    children
}) => {
    return <ModalContainerSearchingStyle>{children}</ModalContainerSearchingStyle >
}
