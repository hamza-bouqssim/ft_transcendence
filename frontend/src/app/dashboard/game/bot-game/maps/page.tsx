"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import GameGuide from "@/app/components/GameGuide";

const ChooseMapBot = () => {
	const swiperRef = useRef<any>(null);
	const [mapIndex, setMapIndex] = useState<number>(0);

	const ImagesSlides: string[] = [
		"/assets/game-maps/default-map.gif",
		"/assets/game-maps/map2-with-obstacles.gif",
		"/assets/game-maps/map3-with-obstacles.gif",
	];

	const mappedImagesSlides: JSX.Element[] = ImagesSlides.map(
		(elem: string, index: number): JSX.Element => (
			<SwiperSlide key={index} style={{ height: "400px", width: "270px" }}>
				<Image
					style={{ height: "100%", objectFit: "cover" }}
					src={elem}
					width={500}
					height={500}
					alt=""
          priority
				/>
			</SwiperSlide>
		),
	);

	return (
    <div className="relative h-[100vh] min-h-[600px] w-full select-none">
      <div className="glassmorphism absolute left-[50%] top-[50%] m-auto flex w-full max-w-[800px] -translate-x-[50%] -translate-y-[50%] flex-col gap-6 p-6">
        <GameGuide />
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
            onSlideChange={() => setMapIndex(swiperRef.current?.swiper.realIndex)
            }
            modules={[EffectCoverflow]}
          >
            {mappedImagesSlides}
          </Swiper>
        </div>
        <Link
          href={`./maps/${mapIndex}`}
          className="glassmorphism m-auto w-fit px-7 py-2 font-['Whitney_Semibold'] duration-150 ease-in-out hover:bg-[--purple-color]"
        >
          Choose
        </Link>
      </div>
    </div>
  );
};

export default ChooseMapBot;
