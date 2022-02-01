import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../../components/admin/Sidebar";
import { UserDocument, TopicsData } from "../../../interfaces/interfaces";
import styles from "../../../styles/admin/UpdateForm.module.scss";
import TopicCreateForm from "../../../components/admin/topic/TopicCreateForm";
import { GetServerSideProps } from "next";

interface TopicUpdateProps {
	user: UserDocument;
	topic: TopicsData;
}

const TopicUpdate: NextPage<TopicUpdateProps> = (props) => {
	const { user, topic } = props;

	return (
		<>
			<Head>
				<title>Update topic - {topic.title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>Topic - "{topic.title}"</h1>
						<TopicCreateForm user={user} topic={topic} />
					</div>
				</div>
			</div>
		</>
	);
};

export default TopicUpdate;

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const token = req.cookies.token || "";
	let user = null;
	let topic = null;

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

	//get topic
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/topic/${query.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (res.ok) {
		topic = await res.json();
	}

	return {
		props: {
			user: user,
			topic: topic,
		},
	};
};
