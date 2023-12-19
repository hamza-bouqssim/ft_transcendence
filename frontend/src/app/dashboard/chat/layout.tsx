"use client";
import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
// import './styles.css'
import { Provider } from "react-redux";
import { User } from "@/app/utils/types";
import { PropsWithChildren } from "react";
import { store } from "@/app/store";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { enableMapSet } from "immer";

enableMapSet();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
