"use client";

import { Page } from "@/app/utils/styles";
import LoginForm from "../../../components/forms/LoginForm";
import styles from "./index.module.scss";
import SideBar from "../../../components/SideBar";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const LoginPage = () => {
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});

	return (
		<div>
			<SideBar
				sideBar={change.sideBar}
				onClick={() =>
					setChange({
						...change,
						sideBar: !change.sideBar,
						chatBox: false,
						menu: false,
					})
				}
			/>
			<Page className={styles.page}>
				<LoginForm />
			</Page>
		</div>
	);
};

export default LoginPage;
