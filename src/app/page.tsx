import Header from "@/app/Header/Header"
import About from "@/app/About/About"
import Team from "@/app/Team/Team"
import Footer from "@/app/Footer/Footer"
import PingPong from "@/app/components/PingPong"
import Authenticate from "@/app/components/Authenticate"

const Home = () => {
  return (
    <main className='font-Whitney text-white'>
      <Header/>
      <About />
      <Team />
      {/* <PingPong >
        <Authenticate />
      </PingPong> */}
      <Footer />
    </main>
  )
}

export default Home