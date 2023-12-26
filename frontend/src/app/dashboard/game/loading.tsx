"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoadingPage = () => {
	const router = useRouter();

	useEffect(() => {
		
		const loadingTimeout = setTimeout(() => {
			router.push("/");
		}, 3000);

		return () => clearTimeout(loadingTimeout);
	}, [router]);

	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<div className="h-16 w-16 animate-spin rounded-full border-8 border-solid border-[--purple-color]"></div>
			<p className="mt-4 font-['Whitney_Bold'] text-2xl text-[--pink-color]">
				Loading...
			</p>
		</div>
	);
};

export default LoadingPage;
