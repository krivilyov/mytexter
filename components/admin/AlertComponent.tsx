import Alert, { AlertColor } from "@mui/material/Alert";
import styles from "../../styles/admin/AlertComponent.module.scss";

type alertValues = {
	show: boolean;
	type: AlertColor;
	message: string;
};

interface AlertComponentProps {
	alertValues: alertValues;
	setAlertValues: (type: alertValues) => void;
}

const AlertComponent = (props: AlertComponentProps) => {
	const { alertValues, setAlertValues } = props;

	return (
		<div className={styles.container}>
			<Alert
				severity={alertValues.type}
				onClose={() => {
					setAlertValues({ ...alertValues, show: false });
				}}
			>
				{alertValues.message}
			</Alert>
		</div>
	);
};

export default AlertComponent;
