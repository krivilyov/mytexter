import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import { UserDocument, WordsData } from "../../interfaces/interfaces";
import WordList from "../../components/admin/word/WordList";

import styles from "../../styles/admin/PageWithList.module.scss";

interface WordsProps {
	user: UserDocument;
	words: WordsData[];
}

export default function Words(props: WordsProps) {
	const { user, words } = props;

	return (
		<>
			<Head>
				<title>Words</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<WordList user={user} words={words} />
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let words = null;

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

	//get words
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		words = await res.json();
	}

	return {
		props: {
			user: user,
			words: words,
		},
	};
};
