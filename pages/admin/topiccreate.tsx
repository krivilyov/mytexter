import type { NextPage } from "next";
import { UserDocument } from "../../interfaces/interfaces";
import Head from "next/head";
import styles from "../../styles/admin/CreateItemPage.module.scss";
import Sidebar from "../../components/admin/Sidebar";
import TopicCreateForm from "../../components/admin/topic/TopicCreateForm";
import { GetServerSideProps } from "next";

interface TopicCrteateProps {
	user: UserDocument;
}

const TopicCrteate: NextPage<TopicCrteateProps> = (props) => {
	const { user } = props;

	return (
		<>
			<Head>
				<title>Create topic</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>New Topic</h1>
						<TopicCreateForm user={user} />
					</div>
				</div>
			</div>
		</>
	);
};

export default TopicCrteate;

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
