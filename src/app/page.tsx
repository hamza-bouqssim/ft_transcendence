import Header from "@/components/Header/Header"
import About from "@/components/About/About"
import Team from "@/components/Team/Team"
import PingPong from "@/PingPong"
import Authenticate from "@/components/Authenticate/Authenticate"

// import localFont from 'next/font/local'

// const whitney = localFont({
//   src: '/fonts/Whitney-Sans-Font/whitney-booksc.otf',
//   variable: '--font-whitney',
// })

const Home = () => {
  return (
    // <main className={`${whitney.variable} font-sans`} >
    <main className='font-Whitney text-white'>
      <Header/>
      <About />
      <Team />
      <Authenticate />
    </main>
  )
}

export default Home