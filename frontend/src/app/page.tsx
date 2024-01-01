"use client";
import Header from "./header/Header";
import About from "./about/About";
import Team from "./team/Team";
import Footer from "./footer/Footer";
import Features from "./features/Features";
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
	return (
    <main className="font-['Whitney_BlackSC'] text-white container m-auto">
      <Header />
      <About />
      <Features />
      <Team />
      <Footer />
    </main>
  );
};

export default Home;
