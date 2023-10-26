"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const PingPong = (props: any) => {
	const threeContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scene: THREE.Scene = new THREE.Scene();
		const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			700,
		);

		scene.background = new THREE.Color(0x272040);
		camera.position.set(0, 4, 100);

		scene.add(camera);

		const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();

		renderer.setSize(window.innerWidth, window.innerHeight);

		window.addEventListener("resize", () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
		threeContainer.current?.appendChild(renderer.domElement);

		const controls: OrbitControls = new OrbitControls(
			camera,
			renderer.domElement,
		);
		renderer.domElement.style.cursor = "grab";

		controls.autoRotate = true;
		controls.enableZoom = false;
		controls.enabled = true;

		const min = -100;
		const max = 100;

		const colArr: number[] = [
			0xffffff, 0xfc7785, 0x6a67f3, 0x498cda, 0x3a3561, 0x332e59,
		];

		for (let i = 0; i < 200; i++) {
			const mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> =
				new THREE.Mesh(
					new THREE.SphereGeometry(5, 32, 16),
					new THREE.MeshStandardMaterial({
						color: colArr[Math.floor(Math.random() * colArr.length)],
					}),
				);
			scene.add(mesh);
			mesh.position.set(
				Math.random() * (max - min + 1) + min,
				Math.random() * (max - min + 1) + min,
				Math.random() * (max - min + 1) + min,
			);
		}
		// Create a directional light
		const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
			0xffffff,
			1,
		);
		directionalLight.position.set(0, 10, 4); // Set the position of the light
		scene.add(directionalLight);

		//Create an ambient light
		const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
			controls.update();
		};
		animate();
	}, []);

	return (
		<div
			ref={threeContainer}
			className="relative flex h-[100vh] items-center justify-center font-['Whitney_Semibold']"
		>
			{props.children}
		</div>
	);
};

export default PingPong;
