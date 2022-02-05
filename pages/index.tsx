import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { UserDocument } from "../interfaces/interfaces";

import styles from "../styles/MainPage.module.scss";

interface HomeProps {
	user?: UserDocument;
}

const Home: NextPage<HomeProps> = (props) => {
	const { user } = props;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<h1>My texter</h1>
				<div className={styles.content}>will be soon</div>
			</div>
		</div>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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

	return {
		props: {
			user: user,
		},
	};
};
