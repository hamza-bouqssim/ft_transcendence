import Image from "next/image"
import './About.css'

const About = () => {

	const images : string[] = ['/assets/NextJs.svg', '/assets/NestJs.svg', '/assets/Docker.svg', '/assets/PostgreSql.svg'];
	const mappedImages = images.map( (el, i) => { 
			return (
				<div>
					<Image className='shrink-0 grow-[1] cursor-pointer transition ease-linear duration-300 hover:scale-125'
						key={i}
						src={el}
						width={100}
						height={100}
						alt={el.substring(8)} />
						<h2 className='text-center'>{el.substring(8, el.lastIndexOf('.'))}</h2>
				</div> 
				) } );

	return (
		<div id='about' className="relative h-[100vh] flex flex-col justify-center items-center py-[59px] px-[15%]">
			<div  className='flex items-center flex-col font-bold'>
				<h2 className='text-[80px] mb-[40px]'>About</h2>
				<p className='sm:w-[700px] mb-[60px] text-[30px] text-center uppercase'>
					ft_transcendence is a real-time multiplayer
					Pong web project with a chat system.
					Built with
				</p>
				<div className="w-[70%] flex justify-center flex-wrap flex-col sm:flex-row items-center gap-[20px] sm:p-[4px]" data-aos="zoom-in-up">
					{mappedImages}
				</div>
			</div>
			<hr className='w-[20%] border-[2px] absolute bottom-0 left-[40%]' />
		</div>
	)
}

export default About