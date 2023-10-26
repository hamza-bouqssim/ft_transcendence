import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const EmailInput = ({ name }: any) => {
	return (
		<div className="relative">
			<FontAwesomeIcon icon={faEnvelope} className="icon-style left-[10%]" />
			<input
				type="email"
				className="custom-shape input-style"
				placeholder="email"
				{...name}
			/>
		</div>
	);
};

export default EmailInput;
