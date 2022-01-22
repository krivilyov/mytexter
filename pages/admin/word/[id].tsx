import {
	UserDocument,
	LanguagesData,
	TopicsData,
	LevelsData,
	WordsData,
} from "../../../interfaces/interfaces";
import Head from "next/head";
import Sidebar from "../../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import WordCreateForm from "../../../components/admin/word/WordCreateForm";

import styles from "../../../styles/admin/CreateItemPage.module.scss";

interface WordUpdateProps {
	user: UserDocument;
	languages: LanguagesData[];
	topics: TopicsData[];
	levels: LevelsData[];
	word: WordsData;
}

export default function WordUpdate(props: WordUpdateProps) {
	const { user, languages, topics, levels, word } = props;

	return (
		<>
			<Head>
				<title>Update word - {word.title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>Word - "{word.title}"</h1>
						<WordCreateForm
							user={user}
							languages={languages}
							topics={topics}
							levels={levels}
							word={word}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const token = req.cookies.token || "";
	let user = null;
	let languages = null;
	let topics = null;
	let levels = null;
	let word = null;

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

	//get updating word
	const wordRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/word/${query.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (wordRes.ok) {
		word = await wordRes.json();
	}

	return {
		props: {
			user: user,
			languages: languages,
			topics: topics,
			levels: levels,
			word: word,
		},
	};
};
