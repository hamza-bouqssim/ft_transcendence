import Image from "next/image";

const Features = () => {
  const featuresArr: string[] = [
    "/assets/chat.png",
    "/assets/auth.png",
    "/assets/2fa.png",
    "/assets/game.png",
  ];

  const mappedFeatures: JSX.Element[] = featuresArr.map(
    (elem: string, index: number) => (
      <div key={index}>
        <Image
          className="shadow-2xl select-none cursor-pointer rounded-[32px] transition duration-300 ease-linear hover:scale-90 md:w-28 lg:w-36 xl:w-36"
          src={elem}
          width={100}
          height={100}
          priority
          alt={elem.substring(8, elem.lastIndexOf("."))}
        />
        <h3 className="text-center text-xs lg:text-sm 2xl:text-xl mt-3">
          {elem.substring(8, elem.lastIndexOf("."))}
        </h3>
      </div>
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
      <p className="text-center text-xs sm:text-sm md:w-96 lg:w-[30rem] lg:text-lg 2xl:w-[38rem] 2xl:text-2xl">
        Enjoy secure multiplayer Pong with in-game chat, robust dual
        authentication, and 2FA for heightened security. Classic Pong, modern
        safeguards, for casual fun or intense competition
      </p>
      <div className="flex flex-wrap justify-center gap-12">
        {mappedFeatures}
      </div>
    </section>
  );
};

export default Features;
