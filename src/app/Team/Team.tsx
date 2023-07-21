import Image from 'next/image';
import './Team.css'

const Team = () => {

	const teams : string[] = ['/assets/yassine.png', '/assets/redouan.png', '/assets/soukaina.png', '/assets/hamza.png'];

	const mappedNames: JSX.Element[] = teams.map( (e, i): JSX.Element => 
		<Image className="border-[2px] border-[var(--blue-color)] rounded-[50%] cursor-pointer transition ease-linear duration-300 hover:scale-90 md:w-28 lg:w-36 xl:w-48 2xl:w-56"
			key={i}
			src={e}
			width={100}
			height={100}
			alt={e.substring(8, e.lastIndexOf('.'))}
		/> );

	return (
		<section id='team' className="py-[120px] px-[15%] flex flex-col items-center gap-6 md:gap-5 lg:gap-7">
			<h2 className="uppercase font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-5xl">Team</h2>
			<div className="flex gap-6 flex-wrap justify-center">
				{mappedNames}
			</div>
		</section>
	)
}

export default Team