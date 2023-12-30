"use client";
import PingPong from "../components/PingPong";
import { GoogleSignInButton, IntraSignInButton } from "../components/Buttons";
import Link from "next/link";
import SignUpForm from "../components/SignUpForm";

const SignUp = () => {
  return (
    <PingPong>
      <div className="custom-shape absolute transition-all duration-700 ease-in-out sm:left-[15%] md:bg-white md:px-8 md:py-8">
        <div className="custom-shape flex flex-col items-center gap-4 bg-white px-4 py-7 transition-all duration-700 ease-in-out sm:gap-5 sm:px-9 sm:py-10 md:bg-transparent md:px-6 md:py-4 2xl:py-36">
          <div className="flex h-8 w-44 items-center justify-center rounded-bl-[37px] rounded-br-[268px] rounded-tl-[268px] rounded-tr-[37px] bg-[var(--gray-color)] transition-all duration-300 sm:h-11 sm:w-64 md:h-12 md:w-72 2xl:h-[70px] 2xl:w-[554px]">
            <div className="h-[80%] w-[48%] rounded-r-[120px] rounded-bl-[37px] rounded-tl-[268px] bg-white p-4 text-center text-[.7rem] text-black transition duration-500 ease-in-out sm:text-sm 2xl:text-lg">
              Sign Up
            </div>
          </div>
          <div className="flex cursor-pointer items-center justify-center gap-4">
            <Link href="http://10.13.10.1:8000/auth/google/login">
              <GoogleSignInButton />
            </Link>
            <Link href="http://10.13.10.1:8000/auth/42/login">
              <IntraSignInButton />
            </Link>
          </div>
          <div className="relative h-[2px] w-56 bg-[#241c1c] md:w-[17rem]">
            <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] transform bg-white px-2 text-[.7rem] text-[#8E8E8E] sm:text-sm md:text-[.9rem]">
              OR
            </span>
          </div>
          <div>
            <SignUpForm />
          </div>
          <Link href={"/signIn"}>
            <h2 className="font-['Whitney_SemiBold'] text-xs text-[--pink-color] underline lg:text-lg xl:text-xl">
              Already Have An Account?
            </h2>
          </Link>
        </div>
      </div>
    </PingPong>
  );
};

export default SignUp;
