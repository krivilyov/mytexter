import Head from "next/head";
import { GetServerSideProps } from "next";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";
import {
	UserDocument,
	TasksData,
	LanguagesData,
} from "../../interfaces/interfaces";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Loader from "../../components/loader";
import axios from "axios";

import styles from "../../styles/cabinet/Settings.module.scss";

interface SettingsProps {
	user: UserDocument;
	userInfo: UserDocument;
	tasks: TasksData[];
	languages: LanguagesData[];
}

export default function Settings(props: SettingsProps) {
	const { user, userInfo, tasks, languages } = props;

	const [values, setValues] = useState({
		userLang: userInfo.userLang,
		learningLang: userInfo.learningLang,
	});

	const [isLoading, setIsLoading] = useState(false);

	const onChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
	) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const userDataSaveHandler = () => {
		setIsLoading(true);
		const data = new FormData();
		data.append("userLang", values.userLang);
		data.append("learningLang", values.learningLang);

		axios
			.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}`, data, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
			});
	};

	return (
		<>
			<Head>
				<title>Settings</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar taskQuantity={tasks.length} />
				<div className={styles.mainContainer}>
					<Header user={userInfo} searchOpen={false} />
					<div className={styles.settingsContainer}>
						<div className={styles.description}>
							Для корректной работы приложения, выбирите правильные параметры
							языка
						</div>
						<Box className={styles.languagesContainer}>
							<FormControl className={styles.formControl} fullWidth>
								<InputLabel id="userLang">Язык пользователя</InputLabel>
								<Select
									labelId="userLang"
									id="userLang"
									name="userLang"
									value={values.userLang}
									label="userLang"
									onChange={onChange}
								>
									{languages.map((language) => {
										if (Number(language.id) !== Number(values.learningLang))
											return (
												<MenuItem key={language.id} value={language.id}>
													{language.title}
												</MenuItem>
											);
									})}
								</Select>
							</FormControl>
							<FormControl className={styles.formControl} fullWidth>
								<InputLabel id="learningLang">Изучаемый язык</InputLabel>
								<Select
									labelId="learningLang"
									id="learningLang"
									name="learningLang"
									value={values.learningLang}
									label="userLang"
									onChange={onChange}
								>
									{languages.map((language) => {
										if (Number(language.id) !== Number(values.userLang))
											return (
												<MenuItem key={language.id} value={language.id}>
													{language.title}
												</MenuItem>
											);
									})}
								</Select>
							</FormControl>
						</Box>
						<div className={styles.saveBtnContainer}>
							<div
								className={styles.saveBtn}
								onClick={() => {
									userDataSaveHandler();
								}}
							>
								{!isLoading ? (
									"Сохранить"
								) : (
									<div className={styles.loaderContainer}>
										<Loader image="/images/loader.svg" />
									</div>
								)}
							</div>
						</div>
					</div>
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

	return {
		props: {
			user: user,
			userInfo: userInfo,
			tasks: tasks,
			languages: languages,
		},
	};
};
