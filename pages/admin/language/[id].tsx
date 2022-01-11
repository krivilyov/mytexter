import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../../components/admin/Sidebar";
import { UserDocument, LanguagesData } from "../../../interfaces/interfaces";
import styles from "../../../styles/admin/UpdateForm.module.scss";
import { GetServerSideProps } from "next";
import LanguageUpdateForm from "../../../components/admin/language/LanguageUpdateForm";

interface LanguageUpdateProps {
	user: UserDocument;
	language: LanguagesData;
}

export default function LanguageUpdate(props: LanguageUpdateProps) {
	const { user, language } = props;

	return (
		<>
			<Head>
				<title>Update language - {language.title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>Language - "{language.title}"</h1>
						<LanguageUpdateForm user={user} language={language} />
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
	let language = null;

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

	//get language
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/language/${query.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (res.ok) {
		language = await res.json();
	}

	return {
		props: {
			user: user,
			language: language,
		},
	};
};
