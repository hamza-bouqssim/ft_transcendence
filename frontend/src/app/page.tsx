"use client"
import Header from "@/app/header/Header";
import About from "@/app/about/About";
import Team from "@/app/team/Team";
import Footer from "@/app/footer/Footer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "./utils/api";
import { User } from "./utils/types";


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
