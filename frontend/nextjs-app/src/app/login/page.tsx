import PingPong from "../components/PingPong";
import Authenticate from "../components/Authenticate";
import "./login.css";

const Login = () => {
	return (
		<PingPong>
			<Authenticate />
		</PingPong>
	);
};

export default Login;
