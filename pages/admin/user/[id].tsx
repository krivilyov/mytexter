import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../../components/admin/Sidebar";
import { UserDocument } from "../../../interfaces/interfaces";
import { GetServerSideProps } from "next";
import UserCreateForm from "../../../components/admin/user/UserCreateForm";

import styles from "../../../styles/admin/UpdateForm.module.scss";

interface UserUpdateProps {
	user: UserDocument;
	currentUser: UserDocument;
}

const UserUpdate: NextPage<UserUpdateProps> = (props) => {
	const { user, currentUser } = props;

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
						<UserCreateForm user={user} currentUser={currentUser} />
					</div>
				</div>
			</div>
		</>
	);
};

export default UserUpdate;

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const token = req.cookies.token || "";
	let user = null;
	let currentUser = null;

	if (token) {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

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

	//get updating user
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/user/${query.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (res.ok) {
		currentUser = await res.json();
	}

	return {
		props: {
			user: user,
			currentUser: currentUser,
		},
	};
};
