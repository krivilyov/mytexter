import { UserDocument, LanguagesData } from "../../../interfaces/interfaces";
import CreateItemContainer from "../CreateItemContainer";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import styles from "../../../styles/admin/MUITable.module.scss";
import axios from "axios";
import AlertDialog from "../AlertDialog";

interface LanguagesListProps {
	user: UserDocument;
	languages: LanguagesData[];
}

const LanguagesList = (props: LanguagesListProps) => {
	const { user, languages } = props;

	const [languagesData, setLanguagesData] = useState(languages);

	const [alertDialogValues, setAlertDialogValues] = useState({
		open: false,
		title: "",
		message: "",
		id: "",
	});
	const [canDeleteValues, setCanDeleteValues] = useState({
		access: false,
		id: "",
	});

	const columns: GridColDef[] = [
		{ field: "id", type: "number", headerName: "ID", flex: 1, align: "left" },
		{
			field: "title",
			headerName: "Title",
			flex: 3,
			align: "left",
		},
		{
			field: "isActive",
			headerName: "isActive",
			flex: 1,
			align: "center",
		},
		{
			field: "action",
			headerName: "Action",
			flex: 1,
			renderCell: (params) => {
				return (
					<div className={styles.actionContainer}>
						<Link href={`/admin/language/${params.row.id}`}>
							<a className={styles.userEditLink}>
								<EditIcon />
							</a>
						</Link>
						<div className={styles.actionDeleteIcon}>
							<DeleteForeverIcon
								color="error"
								fontSize="large"
								onClick={() => handleDelete(params.row.id)}
							/>
						</div>
					</div>
				);
			},
		},
	];

	const handleDelete = (id: string) => {
		setAlertDialogValues({
			open: true,
			title: `Delete language ID: ${id}`,
			message: "Are you sure you want to delete this language?",
			id: id,
		});
	};

	const getLanguages = (token?: string) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/languages`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				setLanguagesData(res.data);
			})
			.catch((error) => {
				if (error.response) {
					console.log(error.response);
				}
			});
	};

	useEffect(() => {
		if (canDeleteValues.id) {
			axios
				.delete(
					`${process.env.NEXT_PUBLIC_API_URL}/api/language/${canDeleteValues.id}`,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					}
				)
				.then((res) => {
					getLanguages(user.token);
					setAlertDialogValues({ ...alertDialogValues, open: false });
				})
				.catch((error) => {
					if (error.response) {
						console.log(error.response);
					}
				});
		}
	}, [canDeleteValues.id]);

	return (
		<>
			<CreateItemContainer link="/admin/languagecreate" btnName="Language" />
			<DataGrid
				rows={languagesData}
				columns={columns}
				pageSize={15}
				rowsPerPageOptions={[15, 25, 50]}
				className={styles.root}
			/>
			<AlertDialog
				alertDialogValues={alertDialogValues}
				setAlertDialogValues={setAlertDialogValues}
				canDeleteValues={canDeleteValues}
				setCanDeleteValues={setCanDeleteValues}
			/>
		</>
	);
};

export default LanguagesList;
