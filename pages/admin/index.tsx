import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import styles from "../../styles/admin/Admin.module.scss";
import { GetServerSideProps } from "next";
import { UserDocument } from "../../interfaces/interfaces";

interface AdminMainProps {
	user: UserDocument;
}

const AdminMain: NextPage<AdminMainProps> = (props) => {
	const { user } = props;

	return (
		<>
			<Head>
				<title>Admin panel</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
			</div>
		</>
	);
};

export default AdminMain;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;

	if (token) {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

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

	return {
		props: {
			user: user,
		},
	};
};
