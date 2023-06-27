import Header from "@/components/Header/Header"
import About from "@/components/About/About"
import Team from "@/components/Team/Team"
import PingPong from "@/PingPong"

// import localFont from 'next/font/local'

// const whitney = localFont({
//   src: '/fonts/Whitney-Sans-Font/whitney-booksc.otf',
//   variable: '--font-whitney',
// })

const Home = () => {
  return (
    // <main className={`${whitney.variable} font-sans`} >
    <main className='font-Whitney'>
      {/* <PingPong /> */}
      <Header/>
      <About />
      <Team />
    </main>
  )
}

export default Home