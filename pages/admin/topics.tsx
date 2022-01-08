import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { UserDocument, TopicsData } from "../../interfaces/interfaces";
import styles from "../../styles/admin/topic/Topics.module.scss";
import { GetServerSideProps } from "next";
import TopicList from "../../components/admin/topic/TopicList";

interface TopicsProps {
	user: UserDocument;
	topics: TopicsData[];
}

const Topics: NextPage<TopicsProps> = (props) => {
	const { user, topics } = props;

	return (
		<>
			<Head>
				<title>Topics</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<TopicList user={user} topics={topics} />
				</div>
			</div>
		</>
	);
};

export default Topics;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let topics = null;

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

	//get topics
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		topics = await res.json();
	}

	return {
		props: {
			user: user,
			topics: topics,
		},
	};
};
