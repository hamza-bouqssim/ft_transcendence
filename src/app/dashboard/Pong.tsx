import Matter from "matter-js";
import { useEffect, useRef } from "react";

const Pong = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let Engine = Matter.Engine,
			Render = Matter.Render,
			Runner = Matter.Runner,
			Bodies = Matter.Bodies,
			Composite = Matter.Composite;

		let engine = Engine.create();

		let render = Render.create({
			element: containerRef?.current as HTMLElement,
			engine: engine,
			options: {
				width: 800,
				height: 400,
				background: "#3A3561",
				wireframes: false,
			},
		});

		let boxA = Bodies.rectangle(400, 200, 80, 80);

		Composite.add(engine.world, boxA);

		Render.run(render);

		let runner = Runner.create();

		Runner.run(runner, engine);
	});

	return <div className="h-full w-full bg-red-600" ref={containerRef}></div>;
};

export default Pong;
