import { IconType } from 'react-icons';
import React from 'react';
import styles from "./page.module.css"


interface AuthSocialButton{
    icon : IconType,
    onClick: () => void;

}

const AuthSocialButton : React.FC<AuthSocialButton> = ({icon : Icon, onClick}) => {
    return (
        <div>
           <button type='button' onClick={onClick} className={styles.button}>
            <Icon/>
            </button>
        </div>
    )
   
}


export default AuthSocialButton; 