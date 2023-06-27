import Image from "next/image"
import './About.css'

const About = () => {

	const images : string[] = ['/assets/NextJs.svg', '/assets/NestJs.svg', '/assets/Docker.svg', '/assets/PostgreSql.svg'];
	const mappedImages = images.map( (el) => { 
			return (
				<div>
					<Image src={el} className='cursor-pointer transition ease-linear duration-300 hover:scale-125'
						width={100}
						height={100}
						alt={el.substring(8)} />
						<h2 className='text-center'>{el.substring(8, el.lastIndexOf('.'))}</h2>
				</div> 
				) } );

	return (
		<div id='about' className="flex flex-col justify-center items-center pt-[59px] pr-[300px] pb-[59px] pl-[300px] h-[1080px] relative">
			<div  className='p-[20px] pl-[100px] pr-[100px] flex items-center flex-col font-bold'>
				<h2 className='text-[80px] mb-[40px]'>About</h2>
				<p className='w-[700px] mb-[60px] text-[30px] text-center uppercase'>
					ft_transcendence is a real-time multiplayer
					Pong web project with a chat system.
					Built with
				</p>
				<div className=' p-[4px] flex justify-center items-center gap-[20px]' data-aos="zoom-in-up">
					{mappedImages}
				</div>
			</div>
			<hr className='w-[20%] border-[2px] absolute bottom-0 left-[40%]' />
		</div>
	)
}

export default About