import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import { UserDocument, LanguagesData } from "../../interfaces/interfaces";
import LanguagesList from "../../components/admin/language/LanguagesList";

import styles from "../../styles/admin/PageWithList.module.scss";

type LanguagesProps = {
	user: UserDocument;
	languages: LanguagesData[];
};

export default function Languages(props: LanguagesProps) {
	const { user, languages } = props;

	return (
		<>
			<Head>
				<title>Languages</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<LanguagesList user={user} languages={languages} />
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let languages = null;

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
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/languages`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		languages = await res.json();
	}

	return {
		props: {
			user: user,
			languages: languages,
		},
	};
};
