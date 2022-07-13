import Head from "next/head";
import { GetServerSideProps } from "next";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";
import { UserDocument, TasksData } from "../../interfaces/interfaces";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";
import { useState } from "react";
import PopupRemove from "../../components/cabinet/PopupRemove";
import axios from "axios";

import styles from "../../styles/cabinet/ProgressPage.module.scss";

interface ProgressProps {
	user: UserDocument;
	userInfo: UserDocument;
	tasks: TasksData[];
}

export default function Progress(props: ProgressProps) {
	const { user, userInfo, tasks } = props;

	const [isShowPopupRemove, setIsShowPopupRemove] = useState(false);
	const [deleteTaskId, setDeleteTaskId] = useState(null || Number);
	const [userTasks, setUserTasks] = useState(tasks);

	const deleteTaskHandler = (e: React.MouseEvent<HTMLElement>, id: number) => {
		e.preventDefault();

		setDeleteTaskId(id);
		setIsShowPopupRemove(true);
	};

	const popupValue = (value: number) => {
		if (!value) {
			setIsShowPopupRemove(false);
		}

		if (value) {
			setIsShowPopupRemove(false);

			axios
				.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/task/${deleteTaskId}`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
					withCredentials: true,
				})
				.then(() => {
					axios
						.get(
							`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${user.id}?order=DESC`,
							{
								headers: { Authorization: `Bearer ${user.token}` },
							}
						)
						.then((res) => {
							setUserTasks(res.data);
						})
						.catch((error) => {
							if (error.response) {
								console.log(error.response);
							}
						});
				})
				.catch((error) => {
					if (error.response) {
						console.log(error.response);
					}
				});
		}
	};

	return (
		<>
			<Head>
				<title>Progress</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar taskQuantity={userTasks.length} />
				<div className={styles.mainContainer}>
					<Header user={userInfo} searchOpen={false} />
					<div className={styles.progressContainer}>
						{userTasks.length ? (
							<>
								<div className={styles.tableHeader}>
									<div className={styles.tableCol_1}>Tasks</div>
									<div className={styles.tableCol_2}>Execution time</div>
									<div className={styles.tableCol_3}>Status</div>
									<div className={styles.tableCol_4}>Delete</div>
								</div>
								<div className={styles.tableBody}>
									{userTasks.map((task, index) => (
										<Link href={`/cabinet/task/${task.id}`} key={index}>
											<a
												className={`${styles.tableRow} ${
													(index + 1) % 2 !== 0 ? styles.tableRowWhite : ""
												}`}
											>
												<div className={styles.tableCol_1}>
													Task number {task.id}
												</div>
												<div className={styles.tableCol_2}>
													<div className={styles.timeIcon}>
														<AccessTimeIcon />
													</div>
												</div>
												<div className={styles.tableCol_3}>
													{task.status ? (
														<div className={styles.checkCircleOutlineIcon}>
															<CheckCircleOutlineIcon />
														</div>
													) : (
														<div className={styles.progressIcon}>
															<svg
																viewBox="0 0 32 12"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<rect width="32" height="12" fill="#FF8B02" />
																<rect
																	x="1"
																	y="1"
																	width="30"
																	height="10"
																	fill="white"
																/>
																<rect
																	x="9"
																	y="2"
																	width="6"
																	height="8"
																	fill="#FF8B02"
																/>
																<rect
																	x="16"
																	y="2"
																	width="6"
																	height="8"
																	fill="#FF8B02"
																/>
																<rect
																	x="2"
																	y="2"
																	width="6"
																	height="8"
																	fill="#FF8B02"
																/>
															</svg>
														</div>
													)}
												</div>
												<div className={styles.tableCol_4}>
													<div
														className={styles.deleteIcon}
														onClick={(e) => deleteTaskHandler(e, task.id)}
													>
														<DeleteOutlineIcon />
													</div>
												</div>
											</a>
										</Link>
									))}
								</div>
							</>
						) : (
							<div>You dont have tasks</div>
						)}
					</div>
					{isShowPopupRemove && <PopupRemove popupValue={popupValue} />}
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let userInfo = null;
	let tasks = null;

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

	//get tasks by user
	const tasksRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${user.id}?order=DESC`,
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
			tasks: tasks,
		},
	};
};
