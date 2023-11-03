import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ListItemParams = {
	icon: any;
	spanText: string;
	additionalStyle: string;
	onClick: any;
};

const ListItem = (props: ListItemParams) => {
	return (
		<li
			onClick={props.onClick}
			className={`group flex cursor-pointer items-center p-5 duration-300 ease-in-out min-[1750px]:p-7 ${props.additionalStyle}`}
		>
			<FontAwesomeIcon
				icon={props.icon}
				className={`h-8 w-8 min-[1750px]:h-11 min-[1750px]:w-11  ${
					props.spanText === "LogOut" ? "rotate-180" : ""
				}`}
			/>
			<span className="ml-8 inline-block duration-150 ease-in-out min-[1750px]:text-xl">
				{props.spanText}
			</span>
		</li>
	);
};

export default ListItem;
