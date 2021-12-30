import styles from "../../styles/admin/UserList.module.scss";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EnhancedTable from "../../components/admin/mui-table/UserListTable";
import { UsersData } from "../../interfaces/interfaces";

interface UserListProps {
	users: UsersData[];
}

const UserList = (props: UserListProps) => {
	const { users } = props;

	return (
		<div className={styles.userList}>
			<div className={styles.createUserContainer}>
				<Button variant="contained" color="success" startIcon={<AddIcon />}>
					User
				</Button>
			</div>
			<EnhancedTable users={users} />
		</div>
	);
};

export default UserList;
