"use client";
import PlayerCard from "../../../../components/PlayerCard";
import { useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { socketContext } from "../../../../utils/context/socketContext";
import { useSearchParams } from "next/navigation";
import { useGameSocket } from "../../../../providers/game-socket-provider";
import { useAtom, useSetAtom } from "jotai";
import { OpponentData } from "../../utils/data";

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const MatchMaking = () => {
	const searchParams = useSearchParams();
	const mapIndex: string | null = searchParams.get("mapIndex");
	const router = useRouter();
	const gameSocket = useGameSocket();
	const setClearAtom = useSetAtom(OpponentData);
	const clearAtomData = () => {
		setClearAtom(() => ({
			opponent: {
				username: "",
				display_name: "",
				avatar_url: "/assets/unknown.png",
			},
			isRotate: false,
			mapIndex: -1,
		}));
	};

	const checkQueryValue = (): boolean => {
		if (mapIndex) {
			const isValidIndex = /^[0-2]$/.test(mapIndex);
			if (isValidIndex) return true;
		}
		return false;
	};

	const redirect = useRef<boolean>(false);

	const { Userdata } = useContext<any>(socketContext);
	const [opponentPlayer, setOpponentPlayer] = useAtom(OpponentData);

	useEffect(() => {

		const handleRedirectUser = (payload: any) => {
			redirect.current = true;
			if (Userdata?.display_name === payload.display_name)
				router.push("/dashboard", { scroll: false });
		};
		gameSocket.on("redirectUser", handleRedirectUser);
		
		const handleKnowOpponent = async (payload: any) => {
			setOpponentPlayer((prevData) => ({
				...prevData,
				opponent: payload.opponent,
				isRotate: payload.rotate,
			}));
			await sleep(3000);
			if(!redirect.current && gameSocket.connected){
				router.push(`./match-making/${mapIndex}/${payload.idGame}`, {
					scroll: false,
				});
			}
			else
				clearAtomData();
		};
		gameSocket.emit("startGame", {
			indexMap: opponentPlayer.mapIndex,
		});
		gameSocket.on("knowOpponent", handleKnowOpponent);

		return () => {
			gameSocket.off("knowOpponent", handleKnowOpponent);
			gameSocket.off("redirectUser", handleRedirectUser);
		};
	}, []);

	return (
		<>
			{checkQueryValue() && opponentPlayer.mapIndex >= 0 ? (
				<section className="absolute left-[50%] top-[50%] flex h-[600px] w-fit -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center gap-10 px-4 md:ml-6 md:flex-row">
					<PlayerCard
						username={Userdata?.username}
						display_name={Userdata?.display_name}
						img={Userdata?.avatar_url}
						additionalStyle="left-7 top-2"
					/>
					<h3 className="font-['Whitney_BlackSc'] text-5xl font-bold sm:text-7xl lg:text-8xl min-[1750px]:text-9xl">
						Vs
					</h3>
					<PlayerCard
						username={opponentPlayer.opponent.username}
						display_name={opponentPlayer.opponent.display_name}
						img={opponentPlayer.opponent.avatar_url}
						additionalStyle={`right-7 bottom-2 ${
							opponentPlayer.opponent.username === "" ? "animate-pulse" : ""
						} `}
					/>
				</section>
			) : (
				router.push("./maps", {
					scroll: false,
				})
			)}
		</>
	);
};

export default MatchMaking;
