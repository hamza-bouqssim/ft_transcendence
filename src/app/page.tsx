import Header from "@/app/Header/Header"
import About from "@/app/About/About"
import Team from "@/app/Team/Team"
import Footer from "@/app/Footer/Footer"

const Home = () => {
  return (
    <main className="font-['Whitney_BlackSC'] text-white">
      <Header/>
      <About />
      <Team />
      <Footer />
    </main>
  )
}

export default Home