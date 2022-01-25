import { UserDocument } from "../../interfaces/interfaces";
import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import LanguageCreateForm from "../../components/admin/language/LanguageCreateForm";

import styles from "../../styles/admin/CreateItemPage.module.scss";

interface LanguageCrteateProps {
	user: UserDocument;
}

export default function LanguageCreate(props: LanguageCrteateProps) {
	const { user } = props;

	return (
		<>
			<Head>
				<title>Create language</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>New Language</h1>
						<LanguageCreateForm user={user} />
					</div>
				</div>
			</div>
		</>
	);
}

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
			user.token = token;
		}
	}

	if (!user || user.role !== "admin") {
		return {
			redirect: {
				destination: "/auth/login",
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
