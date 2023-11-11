"use client"

import React from 'react';
import styles from "./Button.module.css"


interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullWidth?: boolean;
    children?:React.ReactNode;
    OnClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button : React.FC<ButtonProps>= ({type, fullWidth, children, secondary, danger, disabled, OnClick}) => {
    return (
   
            <button onClick={OnClick} type={type} disabled={disabled} className={styles.btn}>{children} </button>
          
   
    )
}


export default Button;