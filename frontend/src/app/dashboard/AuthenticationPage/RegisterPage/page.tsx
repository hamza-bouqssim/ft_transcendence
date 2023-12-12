"use client";
import RegisterForm from "../../../components/forms/RegisterForm";
import { Page } from "@/app/utils/styles";
import styles from "./index.module.scss";
import SideBar from "../../../components/SideBar";
import { useState } from "react";

const AuthentificationPage = () => {
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
				<RegisterForm />
			</Page>
		</div>
	);
};

export default AuthentificationPage;
