import { GetServerSideProps } from "next";
import { UserDocument, TasksData } from "../../../interfaces/interfaces";
import Head from "next/head";
import WordsContainer from "../../../components/cabinet/WordsContainer";
import Sidebar from "../../../components/cabinet/Sidebar";
import Header from "../../../components/cabinet/Header";

import styles from "../../../styles/cabinet/Cabinet.module.scss";

interface TaskProps {
	user: UserDocument;
	userInfo: UserDocument;
	task: TasksData;
	tasks: TasksData[];
}

export default function Task(props: TaskProps) {
	const { userInfo, task, tasks, user } = props;

	return (
		<>
			<Head>
				<title>Task {task.id}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar taskQuantity={tasks.length} />
				<div className={styles.mainContainer}>
					<Header user={userInfo} searchOpen={false} />
					{task.words.length > 0 && (
						<WordsContainer
							type="task"
							task={task}
							words={task.words}
							user={user}
							userInfo={userInfo}
						/>
					)}
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
	let task = null;
	let tasks = null;
	let userInfo = null;

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

	if (!user) {
		return {
			redirect: {
				destination: "/auth/login",
				statusCode: 302,
			},
		};
	}

	//get user info
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (res.ok) {
		userInfo = await res.json();
	}

	//get level
	const TaskRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/task/${query.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (TaskRes.ok) {
		task = await TaskRes.json();
	}

	//get tasks by user
	const tasksRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${user.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (tasksRes.ok) {
		tasks = await tasksRes.json();
	}

	return {
		props: {
			user: user,
			userInfo: userInfo,
			task: task,
			tasks: tasks,
		},
	};
};
