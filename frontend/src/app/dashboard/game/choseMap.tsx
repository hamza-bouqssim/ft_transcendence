import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { forwardRef } from "react";

const ChoseMap = forwardRef(({ onClick }: any, ref: any) => {
	return (
		<div className="relative h-[100vh] min-h-[600px] w-full select-none">
			<div className="glassmorphism absolute left-[50%] top-[50%] m-auto flex w-full max-w-[800px] -translate-x-[50%] -translate-y-[50%] flex-col gap-6 p-6">
				<h1 className="text-center font-['Whitney_Bold'] text-sm lg:text-2xl">
					Select A Map
				</h1>
				<div>
					<Swiper
						ref={ref}
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
						// pagination={{
						// 	el: pag.current!,
						// 	enabled: true,
						// 	clickable: true,
						// 	renderBullet: (index, className) => {
						// 		return `<span class="${className}" style='background-color: #6a67f3 !important'></span>`;
						// 	},
						// }}
						modules={[EffectCoverflow]}
					>
						<SwiperSlide style={{ height: "400px", width: "270px" }}>
							<img
								src="/assets/game-maps/default-map.gif"
								style={{ height: "100%", objectFit: "cover" }}
							/>
						</SwiperSlide>
						<SwiperSlide style={{ height: "400px", width: "270px" }}>
							<img
								src="/assets/game-maps/map2-with-obstacles.gif"
								style={{ height: "100%", objectFit: "cover" }}
							/>
						</SwiperSlide>
						<SwiperSlide style={{ height: "400px", width: "270px" }}>
							<img
								src="/assets/game-maps/map3-with-obstacles.gif"
								style={{ height: "100%", objectFit: "cover" }}
							/>
						</SwiperSlide>
					</Swiper>
				</div>
				<button
					className="glassmorphism m-auto w-fit px-7 py-2 font-['Whitney_Semibold'] duration-150 ease-in-out hover:bg-[--purple-color]"
					onClick={onClick}
				>
					Choose
				</button>
			</div>
		</div>
	);
});

export default ChoseMap;
