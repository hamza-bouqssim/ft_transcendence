"use client";
import { useEffect, useRef } from "react";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PingPong = (props : any) => {

	const threeContainer = useRef<HTMLDivElement>(null);

	useEffect( () => {

	const scene: THREE.Scene = new THREE.Scene();
	const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera( 45, window.outerWidth / 600, 0.1, 700 );

	scene.background = new THREE.Color(0x272040);
	camera.position.set( 0, 4, 100 );

	scene.add( camera );

	const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
	
	renderer.setSize( window.outerWidth, 600 );

	window.addEventListener( 'resize', () => {
		camera.aspect = window.outerWidth / 600;
		camera.updateProjectionMatrix();
		renderer.setSize( window.outerWidth, 600 );
	} )
	threeContainer.current?.appendChild(renderer.domElement);

	const controls: OrbitControls = new OrbitControls( camera, renderer.domElement );
	renderer.domElement.style.cursor = 'grab';

	controls.autoRotate = true;
	controls.enableZoom = false;
	controls.enabled = true

	const min = -100;
	const max = 100;

	const colArr: number[] = [0xffffff, 0xFC7785, 0x6A67F3, 0x498CDA, 0x3A3561, 0x332E59];

	for (let i = 0; i < 200; i++)
	{
		const mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
				new THREE.SphereGeometry( 5, 32, 16 ),
				new THREE.MeshStandardMaterial( { color : colArr[Math.floor(Math.random() * colArr.length)]} )
			);
		scene.add( mesh );
		mesh.position.set(
			Math.random() * (max - min + 1) + min,
			Math.random() * (max - min + 1) + min,
			Math.random() * (max - min + 1) + min
		);
	}
	// Create a directional light
	const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 10, 4); // Set the position of the light
	scene.add(directionalLight);
	
	//Create an ambient light
	const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	const animate = () => { 
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		controls.update();
	}
		animate();
	}, [] );
	
	return (
		<div ref={threeContainer} className="relative h-[600px]" >{props.children}</div>
	)
}

export default PingPong;