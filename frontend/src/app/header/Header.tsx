"use client";
import "./Header.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowDown,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { getAuthUser } from "../utils/api";
import { User } from "../utils/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const ToastError = (message: any) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const ToastSuccess = (message: any) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const controller = new AbortController();
  useEffect(() => {
    setLoading(true);
    getAuthUser()
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  const navRef = useRef<HTMLDivElement>(null),
    barsIconRef = useRef<HTMLDivElement>(null),
    xMarkIconRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget === barsIconRef.current) {
      barsIconRef.current.classList.remove("block");
      barsIconRef.current.classList.add("hidden");
      xMarkIconRef.current?.classList.remove("hidden");
      xMarkIconRef.current?.classList.add("block");
      navRef.current?.classList.remove("hidden");
      navRef.current?.classList.add("block");
    } else {
      xMarkIconRef.current?.classList.remove("block");
      xMarkIconRef.current?.classList.add("hidden");
      barsIconRef.current?.classList.remove("hidden");
      barsIconRef.current?.classList.add("block");
      navRef.current?.classList.remove("block");
      navRef.current?.classList.add("hidden");
    }
  };
  const router = useRouter();
  const logoutFunction = async () => {
    // try {
    // 	await getlogout();
    // 	let data;
    // 	deleteCookie("logged");
    // 	setUser(data);
    // 	router.push("/", { scroll: false });
    // 	ToastSuccess("Logout succeffuly");
    // } catch (err) {
    // 	ToastError("failed to logout");
    // }
  };

  return (
    <header className="px-[15%] py-[59px] 2xl:h-[75vh] 2xl:min-h-[930px]">
      <section className="flex items-center justify-between">
        <div>
          <Image
            className="w-20 md:w-32 xl:w-[100px]"
            key={0}
            src={"/assets/logo.png"}
            width={500}
            height={500}
            alt="ping-pong"
            priority
          />
        </div>
        <div
          ref={barsIconRef}
          className="cursor-pointer text-2xl hover:text-red-500 sm:hidden"
          onClick={(e) => handleClick(e)}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className="glassmorphism default-styles absolute left-1/2 top-12 z-50 flex translate-x-[-50%] flex-col-reverse items-end rounded-xl backdrop-blur-xl">
          <div ref={navRef} className="hidden sm:block">
            <nav className="flex flex-col items-center gap-3 p-2 pb-6 text-xs sm:flex-row sm:p-0 md:text-sm">
              <a
                className="link-style"
                onClick={() => {
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ block: "center" });
                }}
              >
                About
              </a>
              <a
                className="link-style"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ block: "center" });
                }}
              >
                {" "}
                Features
              </a>
              <a
                className="link-style"
                onClick={() => {
                  document
                    .getElementById("team")
                    ?.scrollIntoView({ block: "center" });
                }}
              >
                Team
              </a>
              {!user ? (
                <Link className="btn-style" href={"/signIn"}>
                  Sign In
                </Link>
              ) : (
                <Link
                  href={`${process.env.NEXT_PUBLIC_HOST}/auth/logout`}
                  onClick={logoutFunction}
                  className="btn-style"
                >
                  Sign Out
                </Link>
              )}
            </nav>
          </div>
          <div
            ref={xMarkIconRef}
            className="mr-5 mt-3 hidden w-fit cursor-pointer text-2xl hover:text-red-500 sm:hidden"
            onClick={(e) => handleClick(e)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center justify-between gap-10 md:mt-24 md:flex-row xl:mt-36 2xl:mt-[20rem]">
        <div className="flex flex-col items-center gap-7 sm:px-0 sm:pt-12 xl:gap-10">
          <div className="text-center text-xl font-bold md:w-80 md:text-3xl lg:w-96 xl:text-4xl 2xl:w-[32rem] 2xl:text-5xl">
            <h1>Brace yourself for the epic battle ahead</h1>
          </div>
          <div className="flex flex-col items-center gap-12">
            <div className="py-2 md:text-xl xl:text-2xl">
              <a href="./dashboard/game" className="btn-style">
                Play
              </a>
            </div>
            <div className="animate-bounce text-3xl transition duration-300 ease-in-out hover:cursor-pointer hover:text-[var(--pink-color)] 2xl:text-4xl">
              <FontAwesomeIcon
                icon={faCircleArrowDown}
                onClick={() => {
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ block: "center" });
                }}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none flex justify-center">
          <Image
            key={1}
            className="rotate-[-18deg] rounded-2xl border-2 border-solid border-white mix-blend-lighten shadow-[0_0_50px_2px_var(--blue-color)] sm:w-64 lg:w-80 xl:w-96 2xl:w-[26rem]"
            src="/assets/ping-pong.gif"
            width={190}
            height={190}
            alt="ping-pong"
            priority
          />
        </div>
      </section>
    </header>
  );
};

export default Header;
