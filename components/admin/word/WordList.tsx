import { UserDocument, WordsData } from "../../../interfaces/interfaces";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CreateItemContainer from "../CreateItemContainer";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AlertDialog from "../../admin/AlertDialog";
import Image from "next/image";
import axios from "axios";

import styles from "../../../styles/admin/MUITable.module.scss";

interface WordListProps {
	user: UserDocument;
	words: WordsData[];
}

export default function WordList(props: WordListProps) {
	const { user, words } = props;

	const [wordsData, setWordsData] = useState(words);

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

	const handleDelete = (id: string) => {
		setAlertDialogValues({
			open: true,
			title: `Delete word ID: ${id}`,
			message: "Are you sure you want to delete this word?",
			id: id,
		});
	};

	useEffect(() => {
		if (canDeleteValues.id) {
			axios
				.delete(
					`${process.env.NEXT_PUBLIC_API_URL}/api/word/${canDeleteValues.id}`,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					}
				)
				.then((res) => {
					setWordsData(res.data);
					setAlertDialogValues({ ...alertDialogValues, open: false });
				})
				.catch((error) => {
					if (error.response) {
						console.log(error.response);
					}
				});
		}
	}, [canDeleteValues.id]);

	const columns: GridColDef[] = [
		{ field: "id", type: "number", headerName: "ID", flex: 1, align: "left" },
		{
			field: "title",
			headerName: "Title",
			flex: 2,
			align: "left",
		},
		{
			field: "image",
			headerName: "Image",
			flex: 2,
			align: "center",
			renderCell: (params) => {
				return (
					<div className={styles.imageContainer}>
						{params.row.image ? (
							<Image
								className={styles.image}
								src={`http://localhost:8000/${params.row.image}`}
								alt="user avatar"
								width={100}
								height={80}
							/>
						) : (
							<>&mdash;</>
						)}
					</div>
				);
			},
		},
		{
			field: "topic",
			headerName: "Topic",
			flex: 1,
			align: "left",
			renderCell: (params) => {
				return <>{params.row.topic.title}</>;
			},
		},
		{
			field: "language",
			headerName: "Language",
			flex: 1,
			align: "left",
			renderCell: (params) => {
				return <>{params.row.language.title}</>;
			},
		},
		{
			field: "level",
			headerName: "Level",
			flex: 1,
			align: "left",
			renderCell: (params) => {
				return <>{params.row.level.title}</>;
			},
		},
		{
			field: "isActive",
			headerName: "isActive",
			flex: 1,
			align: "center",
			renderCell: (params) => {
				return (
					<>
						{params.row.is_active ? (
							<RemoveRedEyeIcon />
						) : (
							<VisibilityOffIcon />
						)}
					</>
				);
			},
		},
		{
			field: "action",
			headerName: "Action",
			flex: 1,
			renderCell: (params) => {
				return (
					<div className={styles.actionContainer}>
						<Link href={`/admin/word/${params.row.id}`}>
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

	return (
		<>
			<CreateItemContainer link="/admin/wordcreate" btnName="Word" />
			<DataGrid
				rows={wordsData}
				columns={columns}
				pageSize={15}
				rowsPerPageOptions={[15, 25, 50]}
				className={styles.root}
				rowHeight={80}
			/>
			<AlertDialog
				alertDialogValues={alertDialogValues}
				setAlertDialogValues={setAlertDialogValues}
				canDeleteValues={canDeleteValues}
				setCanDeleteValues={setCanDeleteValues}
			/>
		</>
	);
}
