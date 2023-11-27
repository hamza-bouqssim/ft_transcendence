'use client'

// to avoid multiple className
import clsx from 'clsx'
import {FieldErrors, FieldValues, UseFormRegister} from 'react-hook-form'
import styles from "./page.module.css"

/****In Typescript, “?” represents optional parameters. We use optional parameters when it's not mandatory for that parameter to have a value or to be specified */

/****The true meaning of the optional(type? or requered?) property is that properties can be undefined or null, and we can initialize them whenever required. */

interface InputProps {
    label: string;
    id: string;
    name: string;
    errors: FieldErrors,
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    disabled?: boolean;
    onChange?: (e: any) => void;
    
}

/*******FC stands for function component. If we write a function that returns a React component, we can use this type. const App: React. FC = () => { return <div>Hello</div>; }; If the function does not return a React component, TypeScript will throw an error */


const Input : React.FC<InputProps> = ({label,id,name,type,register,required,disabled, errors, onChange}) => {
    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={id}>{label}</label>
            <div className={styles.inputDiv}>
                {/* We use clxs to pass class names into the packag */}
                {/* <input id={id} type={type} autoComplete={id} disabled={disabled} {...register(id, { required })} className={clsx(`form-input`) }></input> */}
                <input  className={styles.input} id={id}  type={type} autoComplete={id} disabled={disabled} {...register(id, { required })} name={name} onChange={onChange}></input>
            </div>
        </div>
    )
}
export default Input