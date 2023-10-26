import PingPong from "../components/PingPong";
import Authenticate from "../components/Authenticate";
import "./Login.css";

const Login = () => {
	return (
		<PingPong>
			<Authenticate />
		</PingPong>
	);
};

export default Login;
