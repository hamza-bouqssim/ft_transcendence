import React from "react";

interface BoxesProps {
    title : any;
    value : any;
    color:  any;
   }
   


const Boxes : React.FC<BoxesProps> = ({ title, value, color}) => 
{
    return (
        <div className="box-1" style={{ backgroundColor: color}}>
            <h1>{title} </h1>
            <h1>{value}</h1>
        </div>
    );
}

export default Boxes;