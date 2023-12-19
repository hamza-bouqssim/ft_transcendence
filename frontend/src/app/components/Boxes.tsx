import React from "react";

const Boxes = ({
	title,
	value,
	color,
}: {
	title: string;
	value: number;
	color: string;
}) => {
	return (
		<div className="box-1" style={{ backgroundColor: color }}>
			<h1>{title} </h1>
			<h1>{value}</h1>
		</div>
	);
};

export default Boxes;
