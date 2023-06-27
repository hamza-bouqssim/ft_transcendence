import Image from 'next/image';
import './Team.css'

const Team = () => {
	const teams : string[] = ['/assets/yassine.png', '/assets/redouan.png', '/assets/soukaina.png', '/assets/hamza.png'];
	const mappedNames = teams.map( (e) => 
		<Image className='border-[2px] border-[var(--blue-color)] rounded-[50%] mt-[20px] cursor-pointer transition ease-linear duration-300 hover:scale-90'
			src={e}
			width={300}
			height={300}
			alt={e.substring(8, e.lastIndexOf('.'))}
		/> );

	return (
		<div id='team' className='mb-[100px] mt-[70px] pt-[59px] pr-[300px] pb-[59px] pl-[300px] h-[1080px] relative flex justify-center items-center flex-col'>
			<h1 className='text-[80px] mb-[40px] text-center font-bold'>Team</h1>
			<div className='flex items-center justify-center flex-row gap-[30px]' data-aos="zoom-in-down">
				{mappedNames}
			</div>
		</div>
	)
}

export default Team