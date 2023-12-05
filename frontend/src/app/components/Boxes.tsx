import React from "react";

const Boxes = ({title, value, color}) =>
{
    return (
        <div className="box-1" style={{ backgroundColor: color}}>
            <h1>{title} </h1>
            <h1>{value}</h1>
        </div>
    );
}

export default Boxes;