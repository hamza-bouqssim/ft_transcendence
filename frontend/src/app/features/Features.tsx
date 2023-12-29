import Image from "next/image";

const Features = () => {
  const featuresArr: string[] = [
    "/assets/chat.png",
    "/assets/2fa.png",
    "/assets/game.png",
    "/assets/auth.png",
  ];

  const mappedFeatures: JSX.Element[] = featuresArr.map(
    (elem: string, index: number) => (
      <Image
        key={index}
        src={elem}
        width={100}
        height={100}
        alt={""}
        className="select-none cursor-pointer rounded-[32px] transition duration-300 ease-linear hover:scale-90 md:w-28 lg:w-36 xl:w-36"
      />
    )
  );

  return (
    <section
      id="features"
      className="flex flex-col items-center gap-6 px-[15%] py-[120px] md:gap-5 lg:gap-7"
    >
      <h2 className="text-2xl font-bold uppercase sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-5xl">
        Features
      </h2>
      <div className="flex flex-wrap justify-center gap-12">
        {mappedFeatures}
      </div>
    </section>
  );
};

export default Features;
