import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import UserList from "../../components/admin/UserList";
import { GetServerSideProps } from "next";
import { UserDocument } from "../../interfaces/interfaces";
import { UsersData } from "../../interfaces/interfaces";

import styles from "../../styles/admin/Users.module.scss";

interface UsersProps {
	user: UserDocument;
	users: UsersData[];
}

const Users: NextPage<UsersProps> = (props) => {
	const { user, users } = props;

	return (
		<>
			<Head>
				<title>Users</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<UserList users={users} />
			</div>
		</>
	);
};

export default Users;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let users = [];

	if (token) {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.ok) {
			user = await res.json();
		}
	}

	if (!user || user.role !== "admin") {
		return {
			redirect: {
				destination: "/login",
				statusCode: 302,
			},
		};
	}

	//get users list
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		users = await res.json();
	}

	return {
		props: {
			user: user,
			users: users,
		},
	};
};
