"use client";
import Header from "./header/Header";
import About from "./about/About";
import Team from "./team/Team";
import Footer from "./footer/Footer";
import 'react-toastify/dist/ReactToastify.css';

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
