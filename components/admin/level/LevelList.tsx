import { UserDocument, LevelsData } from "../../../interfaces/interfaces";
import CreateItemContainer from "../CreateItemContainer";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import styles from "../../../styles/admin/MUITable.module.scss";
import axios from "axios";
import AlertDialog from "../AlertDialog";

interface LevelListProps {
	user: UserDocument;
	levels: LevelsData[];
}

const LevelList = (props: LevelListProps) => {
	const { user, levels } = props;

	const [levelsData, setLevelsData] = useState(levels);
	const [pageSize, setPageSize] = useState(15);

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
			field: "action",
			headerName: "Action",
			flex: 1,
			renderCell: (params) => {
				return (
					<div className={styles.actionContainer}>
						<Link href={`/admin/level/${params.row.id}`}>
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
			title: `Delete topic ID: ${id}`,
			message: "Are you sure you want to delete this topic?",
			id: id,
		});
	};

	const getLevels = (token?: string) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/levels`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				setLevelsData(res.data);
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
					`${process.env.NEXT_PUBLIC_API_URL}/api/level/${canDeleteValues.id}`,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					}
				)
				.then((res) => {
					getLevels(user.token);
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
			<CreateItemContainer link="/admin/levelcreate" btnName="Level" />
			<DataGrid
				rows={levelsData}
				columns={columns}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				rowsPerPageOptions={[15, 25, 50]}
				pagination
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

export default LevelList;
