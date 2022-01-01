import styles from "../../styles/admin/UserList.module.scss";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UsersData } from "../../interfaces/interfaces";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";

const columns: GridColDef[] = [
	{ field: "id", type: "number", headerName: "ID", flex: 1 },
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
									? params.row.avatar
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
					<Link href={`/user/${params.row.id}`}>
						<a className={styles.userEditLink}>
							<EditIcon />
						</a>
					</Link>
					<div className={styles.actionDeleteIcon}>
						<DeleteForeverIcon color="error" fontSize="large" />
					</div>
				</div>
			);
		},
	},
];

interface Data {
	id: number;
	avatar: string;
	name: string;
	email: string;
	role: string;
}

function createData(
	id: number,
	avatar: string,
	name: string,
	email: string,
	role: string
): Data {
	return {
		id,
		avatar,
		name,
		email,
		role,
	};
}

interface UserListProps {
	users: UsersData[];
}

const UserList = (props: UserListProps) => {
	const { users } = props;

	const getRows = (users: UsersData[]) => {
		const container: Data[] = [];

		if (users.length > 0) {
			users.map((user, index) => {
				container[index] = createData(
					user.id,
					"",
					`${user.name}`,
					`${user.email}`,
					`${user.role}`
				);
			});
		}

		return container;
	};

	const rows = getRows(users);

	return (
		<>
			<div className={styles.createUserContainer}>
				<Link href="/admin/usercreate">
					<Button variant="contained" color="success" startIcon={<AddIcon />}>
						User
					</Button>
				</Link>
			</div>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[10, 25, 50]}
				checkboxSelection
				className={styles.root}
			/>
		</>
	);
};

export default UserList;
