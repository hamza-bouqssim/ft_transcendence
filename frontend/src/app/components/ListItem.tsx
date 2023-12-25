import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ListItemParams = {
	icon: any;
	spanText: string;
	additionalStyle: string;
};

const ListItem = (props: ListItemParams) => {
	return (
		<li
			className={`group flex cursor-pointer items-center p-5 duration-500 ease-in-out min-[1750px]:p-7 ${props.additionalStyle}`}
		>
			<FontAwesomeIcon
				icon={props.icon}
				className={`h-8 w-8 min-[1750px]:h-11 min-[1750px]:w-11 ${
					props.spanText === "LogOut" ? "rotate-180" : ""
				}`}
			/>
		</li>
	);
};

export default ListItem;
