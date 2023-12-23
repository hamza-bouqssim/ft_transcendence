import Image from "next/image";
import { useState } from "react";

const EditImage = () => {
	const [src, setSrc] = useState<string>("/assets/hamza.png");
	return (
		<div className="flex flex-col items-center justify-between border-b border-[#9f9f9f4a] pb-3 md:flex-row ">
			<div>
				<Image
					className="h-24 w-24 rounded-[50%] bg-sky-200 min-[1750px]:h-24 min-[1750px]:w-24"
					src={src}
					width={72}
					height={51}
					alt="user"
				/>
			</div>
			<div className="my-3 ml-6">
				<button
					className="cursor-pointer rounded-[20px] px-6 py-3"
					onClick={() => {}}
				>
					Change Photo
				</button>
			</div>
			<div className="my-3 ml-6">
				<input
					type="button"
					className="rounded-[20px] bg-[#EA7F87] px-8 py-3"
					onClick={() => {
						setSrc("/assets/unknown.png");
					}}
					value="Delete"
				/>
			</div>
		</div>
	);
};
export default EditImage;
