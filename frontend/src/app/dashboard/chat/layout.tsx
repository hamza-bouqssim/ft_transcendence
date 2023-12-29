"use client"
import CoversationSideBar from "../../components/CoversationSideBar/ConversationSideBar";
// import './styles.css'
import { Provider } from "react-redux";
import { User } from "../../utils/types";
import { PropsWithChildren } from "react";
import { store } from "../../store";
import { socket, socketContext } from "../../utils/context/socketContext";
import { enableMapSet } from "immer";

enableMapSet();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
