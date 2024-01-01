const LoadingPage = () => {

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
