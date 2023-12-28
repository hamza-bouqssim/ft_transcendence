"use client";

import { GameSocketProvider } from "../../../../providers/game-socket-provider";
import { ReactNode } from "react";

const GameLayout = ({ children }: { children: ReactNode }) => {
	return <GameSocketProvider>{children}</GameSocketProvider>;
};

export default GameLayout;
