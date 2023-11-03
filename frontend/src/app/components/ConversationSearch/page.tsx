import styles from "./index.module.scss";
import { MdSearch } from "react-icons/md";

const ConversationSearch = () => {
	return (
		<div className={styles.div}>
			<input
				className={styles.h1}
				placeholder="Research/ Lancer une conversation"
			></input>
			{/* <MdSearch size={30} className={styles.search}/> */}
		</div>
	);
};

export default ConversationSearch;
