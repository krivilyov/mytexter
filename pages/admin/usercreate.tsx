import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { UserDocument } from "../../interfaces/interfaces";
import { GetServerSideProps } from "next";
import styles from "../../styles/admin/UserCreate.module.scss";
import UserDataForm from "../../components/admin/UserDataForm";

interface UserCreateProps {
	user: UserDocument;
}

const UserCreate: NextPage<UserCreateProps> = (props) => {
	const { user } = props;

	return (
		<>
			<Head>
				<title>Users</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>New User</h1>
						<UserDataForm user={user} />
					</div>
				</div>
			</div>
		</>
	);
};

export default UserCreate;

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
			user.token = token;
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
