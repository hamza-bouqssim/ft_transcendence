"use client";
import PlayerCard from "../../../../components/PlayerCard";
import { ChangeContext } from "../../../layout";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { socketContext } from "@/app/utils/context/socketContext";
import { useSearchParams } from "next/navigation";
import { useGameSocket } from "@/app/providers/game-socket-provider";
import { useAtom } from "jotai";
import { OpponentData } from "../../utils/data";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import { fetchGetAllFriendsThunk } from "@/app/store/friendsSlice";

// const sleep = async (ms: number) =>
// 	new Promise((resolve) => setTimeout(resolve, ms));

const MatchMaking = () => {

	const searchParams = useSearchParams();
	const mapIndex: string | null = searchParams.get("mapIndex");
	const { change, setChange } = useContext(ChangeContext);
	const router = useRouter();
	const gameSocket = useGameSocket();
	const checkQueryValue = (): boolean => {
		if (mapIndex) {
			const isValidIndex = /^[0-2]$/.test(mapIndex);
			if (isValidIndex) return true;
		}
		return false;
	};

	const { Userdata } = useContext<any>(socketContext);
	const [opponentPlayer, setOpponentPlayer] = useAtom(OpponentData);

	useEffect(() => {
		const handleRedirectUser = (payload: any) => {
			if (Userdata?.display_name === payload.display_name)
				router.push("/dashboard/chat", { scroll: false });
		};
		gameSocket.on("redirectUser", handleRedirectUser);

		const handleKnowOpponent = (payload: any) => {
			setOpponentPlayer((prevData) => ({
				...prevData,
				opponent: payload.opponent,
				isRotate: payload.rotate,
			}));
			router.push(`./match-making/${mapIndex}/${payload.idGame}`, {
				scroll: false,
			});
		};
		console.log("setup start game event");
		gameSocket.emit("startGame", {
			indexMap: mapIndex,
		});
		gameSocket.on("knowOpponent", handleKnowOpponent);
		return () => {
			console.log("remove start game event");
			gameSocket.off("knowOpponent", handleKnowOpponent);
			gameSocket.off("redirectUser", handleRedirectUser);
		};
	}, []);

	return (
		<>
			{checkQueryValue() ? (
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
				router.push("./maps", { scroll: false })
			)}
		</>
	);
};

export default MatchMaking;




