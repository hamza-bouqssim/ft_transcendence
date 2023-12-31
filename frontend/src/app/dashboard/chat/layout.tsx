"use client"

import { enableMapSet } from "immer";

enableMapSet();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
