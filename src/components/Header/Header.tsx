import './Header.css'

const Header = () => {
	return (
		<header className='flex justify-between items-center'>
			<div>
				<img src="" alt="logo" />
			</div>
			<nav >
				<a href="#" className='link-style text-white'>About</a>
				<a href="#" className='link-style text-white'>Team</a>
				<a href="#" className='link-style text-white'>Features</a>
				<a href="#" className='bg-[--purple-color] text-white pl-4 pr-4 pt-2 pb-2 rounded-[30px] '>Sign In</a>
			</nav>
		</header>
	)
}

export default Header 