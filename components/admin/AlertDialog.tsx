import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type alertDialogValues = {
	open: boolean;
	title: string;
	message: string;
	userId: string;
};

type canDeleteValues = {
	access: boolean;
	id: string;
};

interface AlertDialofProps {
	alertDialogValues: alertDialogValues;
	canDeleteValues: canDeleteValues;
	setAlertDialogValues: (type: alertDialogValues) => void;
	setCanDeleteValues: (type: canDeleteValues) => void;
}

const AlertDialog = (props: AlertDialofProps) => {
	const {
		alertDialogValues,
		canDeleteValues,
		setAlertDialogValues,
		setCanDeleteValues,
	} = props;

	return (
		<div>
			<Dialog
				open={alertDialogValues.open}
				onClose={() => {
					setCanDeleteValues({
						...canDeleteValues,
						access: false,
					});
					setAlertDialogValues({ ...alertDialogValues, open: false });
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{alertDialogValues.title}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{alertDialogValues.message}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setCanDeleteValues({
								...canDeleteValues,
								access: false,
							});
							setAlertDialogValues({ ...alertDialogValues, open: false });
						}}
					>
						No
					</Button>
					<Button
						autoFocus
						onClick={() =>
							setCanDeleteValues({
								...canDeleteValues,
								access: true,
								id: alertDialogValues.userId,
							})
						}
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AlertDialog;
