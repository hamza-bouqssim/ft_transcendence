import { ModalContainerStyle, ModalContentBodyStyle, ModalHeadersStyle } from "@/app/utils/styles";
import { FC, PropsWithChildren } from "react";

export const ModalHeader : FC<PropsWithChildren> = ({ children }) => {
    return (
      
        <ModalHeadersStyle>{children}</ModalHeadersStyle>
        
   
    )
}

export const ModalContentBody: FC<PropsWithChildren> = ({
    children
}) => {
    return (
    <ModalContentBodyStyle>
            {children}
    </ModalContentBodyStyle>)
}


export const ModalContainer : FC<PropsWithChildren> = ({
    children
}) => {
    return <ModalContainerStyle>{children}</ModalContainerStyle>
}


