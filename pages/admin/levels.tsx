import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import { UserDocument, LevelsData } from "../../interfaces/interfaces";

import styles from "../../styles/admin/PageWithList.module.scss";
import LevelList from "../../components/admin/level/LevelList";

type LevelsProps = {
	user: UserDocument;
	levels: LevelsData[];
};

export default function Levels(props: LevelsProps) {
	const { user, levels } = props;

	return (
		<>
			<Head>
				<title>Language level</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<LevelList user={user} levels={levels} />
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let levels = null;

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

	//get levels
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/levels`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		levels = await res.json();
	}

	return {
		props: {
			user: user,
			levels: levels,
		},
	};
};
