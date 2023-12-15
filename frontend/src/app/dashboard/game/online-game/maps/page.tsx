"use client";
import { Swiper } from "swiper/react";
import { useRef, useState } from "react";
import Link from "next/link";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { mappedImagesSlides } from "../../bot-game/maps/page";

const ChoseMapOnline = () => {
	const swiperRef = useRef<any>(null);
	const [mapIndex, setMapIndex] = useState<number>(0);

	return (
		<div className="relative h-[100vh] min-h-[600px] w-full select-none">
			<div className="glassmorphism absolute left-[50%] top-[50%] m-auto flex w-full max-w-[800px] -translate-x-[50%] -translate-y-[50%] flex-col gap-6 p-6">
				<h1 className="text-center font-['Whitney_Bold'] text-sm lg:text-2xl">
					Select A Map
				</h1>
				<div>
					<Swiper
						ref={swiperRef}
						effect={"coverflow"}
						grabCursor={true}
						centeredSlides={true}
						slidesPerView={"auto"}
						coverflowEffect={{
							rotate: 50,
							stretch: 0,
							depth: 100,
							modifier: 1,
							slideShadows: true,
						}}
						onSlideChange={() =>
							setMapIndex(swiperRef.current?.swiper.realIndex)
						}
						modules={[EffectCoverflow]}
					>
						{mappedImagesSlides}
					</Swiper>
				</div>
				{/* <SocketContext.Provider value={socket}> */}
				<Link
					href={{
						pathname: "./match-making",
						query: { mapIndex },
					}}
					className="glassmorphism m-auto w-fit px-7 py-2 font-['Whitney_Semibold'] duration-150 ease-in-out hover:bg-[--purple-color]"
				>
					Choose
				</Link>
				{/* </SocketContext.Provider> */}
			</div>
		</div>
	);
};

export default ChoseMapOnline;
