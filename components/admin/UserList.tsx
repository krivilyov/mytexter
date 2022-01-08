import styles from "../../styles/admin/MUITable.module.scss";
import { UsersData } from "../../interfaces/interfaces";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";
import { useEffect, useState } from "react";
import AlertDialog from "../admin/AlertDialog";
import axios from "axios";
import { UserDocument } from "../../interfaces/interfaces";
import CreateItemContainer from "./CreateItemContainer";

interface UserListProps {
	users: UsersData[];
	user: UserDocument;
}

const UserList = (props: UserListProps) => {
	const { users, user } = props;

	const [usersData, setUsersData] = useState(users);
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
			title: `Delete user ID: ${id}`,
			message: "Are you sure you want to delete this user?",
			id: id,
		});
	};

	const getUsers = (token?: string) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				const updatedUsers = res.data;
				setUsersData(updatedUsers);
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
					`${process.env.NEXT_PUBLIC_API_URL}/api/user/${canDeleteValues.id}`,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					}
				)
				.then((res) => {
					getUsers(user.token);
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
		{ field: "id", type: "number", headerName: "ID", flex: 1, align: "center" },
		{
			field: "name",
			headerName: "User name",
			flex: 3,
			renderCell: (params) => {
				return (
					<div className={styles.userInfo}>
						<div className={styles.userAvatar}>
							<Image
								className={styles.userAvatarImage}
								src={
									params.row.avatar
										? `http://localhost:8000/${params.row.avatar}`
										: "/images/empty_avatar.jpg"
								}
								alt="user avatar"
								width={200}
								height={200}
							/>
						</div>
						<div className={styles.userName}>{params.row.name}</div>
					</div>
				);
			},
		},
		{ field: "email", headerName: "Email", flex: 3 },
		{ field: "role", headerName: "Role", flex: 1 },
		{
			field: "action",
			headerName: "Action",
			flex: 1,
			renderCell: (params) => {
				return (
					<div className={styles.actionContainer}>
						<Link href={`/admin/user/${params.row.id}`}>
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
			<CreateItemContainer link="/admin/usercreate" btnName="User" />
			<DataGrid
				rows={usersData}
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

export default UserList;
