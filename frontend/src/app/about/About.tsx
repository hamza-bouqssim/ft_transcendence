import Image from "next/image";
import "./About.css";

const About = () => {
	const images: string[] = [
		"/assets/nextJs.svg",
		"/assets/nestJs.svg",
		"/assets/docker.svg",
		"/assets/postgreSql.svg",
	];
	const mappedImages = images.map((el, i) => {
		return (
		<div key={i}>
			<Image
			className="w-16 pointer-events-none cursor-pointer transition duration-300 ease-linear hover:scale-125 lg:w-20 2xl:w-24"
			src={el}
			width={100}
			height={100}
			alt={el.substring(8)}
			priority={true}
			/>
			<h3 className="text-center text-xs lg:text-sm 2xl:text-xl">
			{el.substring(8, el.lastIndexOf("."))}
			</h3>
		</div>
    );
	});
	return (
		<section
			id="about"
			className="flex flex-col items-center gap-6 px-[15%] py-[120px] font-bold md:gap-5 lg:mt-8 lg:gap-7 2xl:mt-10"
		>
			<div className="flex flex-col items-center justify-center gap-4 uppercase lg:gap-7 2xl:gap-14">
				<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-5xl">
					About
				</h2>
				<p className="text-center text-xs sm:text-sm md:w-96 lg:w-[30rem] lg:text-lg 2xl:w-[38rem] 2xl:text-2xl">
					ft_transcendence is a real-time multiplayer Pong web project with a
					chat system. Built with
				</p>
			</div>
			<div className="flex justify-center gap-2 md:gap-3 lg:gap-4">
				{mappedImages}
			</div>
		</section>
	);
};

export default About;
