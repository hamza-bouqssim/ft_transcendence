// "use client";
// import { useEffect } from "react";
import "./Header.css";
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Header = () => {
	// useEffect(() => {
	// 	const scene: any = new THREE.Scene();
	// 	const camera: any = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	// 	scene.add( camera );
		
	// 	const mesh: any = new THREE.Mesh(
	// 		new THREE.BoxGeometry( 1, 1, 1 ),
	// 		new THREE.MeshBasicMaterial({ color: 0X6A67F3 })
	// 		);
	// 	scene.add( mesh );
	// 	camera.position.z = 6;

	// 	const renderer: any = new THREE.WebGLRenderer(
	// 		{
	// 			canvas: document.querySelector('#ping-pong') as HTMLCanvasElement
	// 		}
	// 	);
	// 	const controls: any = new OrbitControls( camera, renderer.domElement );
	// 	controls.autoRotate = true;
	// 	const animate = () => {
	// 		requestAnimationFrame(animate);
	// 		renderer.render( scene, camera );
	// 		mesh.rotation.x += 0.002;
	// 		mesh.rotation.y += 0.002;
	// 		controls.update()
	// 	}
	// 	animate();
	// }
	// , []);

	return (
		<header>
			<section className="flex justify-between items-center">
				<div>
					<Image className='mix-blend-lighten'
						src="/assets/42.svg"
						width={60}
						height={60}
						alt="ping-pong"
					/>
				</div>
				<nav>
					<a href="#" className="link-style text-white">
						About
					</a>
					<a href="#" className="link-style text-white">
						Team
					</a>
					<a href="#" className="link-style text-white">
						Features
					</a>
					<a
						href="#"
						className="btn-style"
					>
						Sign In
					</a>
				</nav>
			</section>
			<section className="flex justify-between items-center mt-[150px]">
				<div className='flex justify-between flex-col items-center pt-[40px] pb-[40px] mt-[40px] text-[25px] font-bold'>
					<h1 className='w-[450px] text-white text-[40px] text-center font-bold' >Brace yourself for the epic battle ahead</h1>
					<a href="#" className='inline-block btn-style w-[150px] text-center mt-[50px]'>Play</a>
					<FontAwesomeIcon icon={faCircleArrowDown} className='text-white w-[45px] mt-[80px] hover:cursor-pointer animate-bounce hover:text-[var(--pink-color)] transition ease-in-out duration-300'/>
				</div>
				<Image className='mix-blend-lighten border-solid border-white border-2 rounded-[30px] rotate-[-15deg] shadow-[0_0_50px_2px_var(--blue-color)]'
					src="/assets/ping-pong.gif"
					width={450}
					height={450}
					alt="ping-pong"
				/>
				{/* <canvas id='ping-pong' className='mix-blend-lighten h-[300%] w-[200%]'></canvas> */}
			</section>
				<hr className='text-white w-[50%] mt-[80px] ml-[25%]' />
		</header>
	);
};

export default Header;
