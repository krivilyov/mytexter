import Alert, { AlertColor } from "@mui/material/Alert";
import styles from "../../styles/admin/AlertComponent.module.scss";

interface AlertComponentProps {
	type: AlertColor;
	message: string;
	setShowAlert: (type: boolean) => void;
}

const AlertComponent = (props: AlertComponentProps) => {
	const { type = "success", message, setShowAlert } = props;

	return (
		<div className={styles.container}>
			<Alert severity={type} onClose={() => setShowAlert(false)}>
				{message}
			</Alert>
		</div>
	);
};

export default AlertComponent;
