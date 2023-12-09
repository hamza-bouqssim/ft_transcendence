"use client"
import Header from "@/app/header/Header";
import About from "@/app/about/About";
import Team from "@/app/team/Team";
import Footer from "@/app/footer/Footer";
import React, { useEffect, useState } from "react";
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
	
	return (
			<main className="font-['Whitney_BlackSC'] text-white">
				<Header />
				<About />
				<Team />
				<Footer />
				{/* <ToastContainer /> */}
			</main>
		
	);
};

export default Home;
