"use client";
import { useEffect } from "react";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PingPong = () => {
	useEffect( () =>{

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 0.1, 700 );

	scene.background = new THREE.Color(0x272040);
	camera.position.set( 0, 4, 100 );

	scene.add( camera );

	const renderer = new THREE.WebGLRenderer();
	
	renderer.setSize( window.innerWidth, window.innerHeight );

	window.addEventListener( 'resize', () => {
		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	} )

	document.body.appendChild( renderer.domElement );

	const controls = new OrbitControls( camera, renderer.domElement );
	controls.autoRotate = true;
	controls.enableZoom = false;
	controls.enabled = true

	const min = -100;
	const max = 100;

	const colArr = [0xffffff, 0xFC7785, 0x6A67F3, 0x498CDA, 0x3A3561, 0x332E59];

	for (let i = 0; i < 200; i++)
	{
		const mesh = new THREE.Mesh(
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
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 10, 4); // Set the position of the light
	scene.add(directionalLight);
	
	//Create an ambient light
	const ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	const animate = () => { 
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		controls.update();
	}
	animate();
	}, [] );
	
	return <></>
}

export default PingPong;