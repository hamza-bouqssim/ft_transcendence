import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import Pong from "../classes/Pong";
import Paddle from "../classes/Paddle";
import Ball from "../classes/Ball";

const Pongg = () => {
	const [change, setChange] = useState<{
		toggle: boolean;
		button: boolean;
		paused: boolean;
	}>({
		toggle: false,
		button: false,
		paused: false,
	});
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;

		const paddles = {
			left: new Paddle(50, canvas.height / 2, 10, 150, "#FF5269"),
			right: new Paddle(
				canvas.width - 50,
				canvas.height / 2,
				10,
				150,
				"#4FD6FF",
			),
		};

		const ball = new Ball(canvas.width / 2, canvas.height / 2, 15, "white");

		let pong = new Pong(
			canvas,
			paddles.right,
			paddles.left,
			ball,
			change.paused,
		);

		pong.init();
		pong.draw();
		pong.start();
	}, [change.paused]);

	// useEffect(()=>{
	// 	meth();
	// }, [change.paused])

	return (
		<div className="fixed top-16 flex h-[600px] w-full items-end justify-between px-14 py-8">
			<canvas
				className=" h-[440px] w-[90%] max-w-[750px] rounded-3xl border-2 border-solid border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)]"
				ref={canvasRef}
				width={800}
				height={600}
			></canvas>
			<div className="relative flex h-[520px] w-[350px] flex-col items-center rounded-3xl border-2 border-solid border-[#CFF4FF] py-16 font-['Whitney_Semibold'] text-lg shadow-[0_0_50px_2px_var(--blue-color)]">
				<span className="absolute -top-5 left-[50%] -translate-x-[50%] rounded-3xl border-b-2 border-solid border-[#CFF4FF] bg-[--purple-color] px-7 py-2 font-['Whitney_Bold'] text-2xl font-bold shadow-[0_0_50px_2px_var(--blue-color)]">
					Settings
				</span>

				<div className="relative flex w-[70%] items-center justify-between border-b-2 border-solid border-[#CFF4FF] p-1">
					<span>Sounds</span>
					<FontAwesomeIcon
						icon={faToggleOn}
						className={`cursor-pointer text-3xl text-[--pink-color] ${
							change.toggle ? "hidden" : "block"
						}`}
						onClick={() => setChange({ ...change, toggle: !change.toggle })}
					/>
					<FontAwesomeIcon
						icon={faToggleOff}
						className={`cursor-pointer text-3xl ${
							change.toggle ? "block" : "hidden"
						}`}
						onClick={() => setChange({ ...change, toggle: !change.toggle })}
					/>
				</div>
				<button
					className={`w-full rounded-xl border-b-2 border-solid border-[#CFF4FF] ${
						change.button ? "bg-[#FF5269]" : "bg-[#4FD6FF]"
					} py-1 shadow-[0_0_50px_2px_var(--blue-color)]`}
					onClick={() =>
						setChange({
							...change,
							button: !change.button,
							paused: !change.paused,
						})
					}
				>
					"QUIT "
				</button>
				<div className="absolute bottom-16 w-[70%] text-center">
					<button
						className={`w-full rounded-xl border-b-2 border-solid border-[#CFF4FF] ${
							change.button ? "bg-[#FF5269]" : "bg-[#4FD6FF]"
						} py-1 shadow-[0_0_50px_2px_var(--blue-color)]`}
						onClick={() =>
							setChange({
								...change,
								button: !change.button,
								paused: !change.paused,
							})
						}
					>
						{change.button ? "PLAY" : `PAUSE`}
					</button>
					<span className="mt-2 inline-block text-center text-[13.5px] text-[#FF5269]">
						note: This button works only in{" "}
						<span className="text-[#4FD6FF]">BOT mode</span>.
					</span>
				</div>
			</div>
		</div>
	);
};

export default Pongg;
