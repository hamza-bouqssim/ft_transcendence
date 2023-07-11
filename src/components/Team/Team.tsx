import Image from 'next/image';
import './Team.css'

const Team = () => {

	const teams : string[] = ['/assets/yassine.png', '/assets/redouan.png', '/assets/soukaina.png', '/assets/hamza.png'];

	const mappedNames: JSX.Element[] = teams.map( (e, i): JSX.Element => 
		<Image className='border-[2px] border-[var(--blue-color)] rounded-[50%] mt-[20px] cursor-pointer transition ease-linear duration-300 hover:scale-90 sm:w-[250px] xl:w-[220px]'
			key={i}
			src={e}
			width={300}
			height={300}
			alt={e.substring(8, e.lastIndexOf('.'))}
		/> );

	return (
		<div id='team' className='relative h-[1080px] flex justify-center items-center flex-col py-[59px] px-[15%]'>
			<h1 className='text-[80px] mb-[40px] text-center font-bold'>Team</h1>
			<div className='flex items-center justify-evenly gap-[30px] flex-wrap w-[100%]'>
				{mappedNames}
			</div>
		</div>
	)
}

export default Team