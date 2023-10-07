import { store } from "@/redux_toolkit/store";
import { Provider } from "react-redux";

const Home = () => {
	return (
		<div>
			<Provider store={store}>
				<div>Home Page</div>
			</Provider>
		</div>
	);
};

export default Home;
