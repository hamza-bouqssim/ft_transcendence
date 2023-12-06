"use client"
import Header from "@/app/header/Header";
import About from "@/app/about/About";
import Team from "@/app/team/Team";
import Footer from "@/app/footer/Footer";

const Home = () => {
	
	return (
			<main className="font-['Whitney_BlackSC'] text-white">
				<Header />
				<About />
				<Team />
				<Footer />
			</main>
		
	);
};

export default Home;
