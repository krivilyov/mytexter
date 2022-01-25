import {
	UserDocument,
	LanguagesData,
	TopicsData,
	LevelsData,
} from "../../interfaces/interfaces";
import Head from "next/head";
import styles from "../../styles/admin/CreateItemPage.module.scss";
import Sidebar from "../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import WordCreateForm from "../../components/admin/word/WordCreateForm";

interface WordCreateProps {
	user: UserDocument;
	languages: LanguagesData[];
	topics: TopicsData[];
	levels: LevelsData[];
}

export default function WordCreate(props: WordCreateProps) {
	const { user, languages, topics, levels } = props;

	return (
		<>
			<Head>
				<title>Create word</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>New Word</h1>
						<WordCreateForm
							user={user}
							languages={languages}
							topics={topics}
							levels={levels}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let languages = null;
	let topics = null;
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

	//get languages
	const languagesRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/languages`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (languagesRes.ok) {
		languages = await languagesRes.json();
	}

	//get topics
	const topicsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/topics`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (topicsRes.ok) {
		topics = await topicsRes.json();
	}

	//get levels
	const levelsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/levels`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (levelsRes.ok) {
		levels = await levelsRes.json();
	}

	return {
		props: {
			user: user,
			languages: languages,
			topics: topics,
			levels: levels,
		},
	};
};
