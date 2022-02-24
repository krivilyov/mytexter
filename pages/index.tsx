import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Input from "../components/input";
import Loader from "../components/loader";
import { useState } from "react";
import { errors } from "../lib/messages";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import styles from "../styles/MainPage.module.scss";

export default function Home() {
	const [loader, isLoader] = useState(false);
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value.trim());
	};

	const handleCheckErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (email.length) {
			const filterEmail =
				/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filterEmail.test(String(email).toLowerCase()))
				setError(errors.email.wrong);
			else setError("");
		} else {
			setError("");
		}
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (formValidate()) {
			isLoader(true);

			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/subscription`,
					{
						email: email,
					},
					{ withCredentials: true }
				)
				.then((res) => {
					isLoader(false);
					setSent(true);
				})
				.catch((error) => {
					if (error.response) {
						handleErrorForm(error.response.data);
					}
				});
		}
	};

	const formValidate = (): boolean => {
		let validateEmail = true;

		if (email.length) {
			const filterEmail =
				/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filterEmail.test(String(email).toLowerCase())) {
				validateEmail = false;
				setError(errors.email.wrong);
			} else setError("");
		} else {
			validateEmail = false;
			setError(errors.field.empty);
		}

		return validateEmail;
	};

	type Errors = {
		email: string;
	};

	const handleErrorForm = (errors: Errors) => {
		isLoader(false);
		if (errors.email) {
			setError(errors.email);
		}
	};

	const handleClose = () => {
		setEmail("");
		setSent(false);
	};

	return (
		<>
			<Head>
				<title>My Texter</title>
				<meta
					name="description"
					content="Учись  сам  или с учителем. Получай готовые задания или собирай свои. Описывай сюжетные картинки  и учи языки эффективно с My Texter."
				></meta>
				<meta name="keywords" content="My Texter, обучение, языки"></meta>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content="https://my-texter.com/" />
				<meta name="twitter:title" content="My Texter" />
				<meta
					name="twitter:description"
					content="Учись  сам  или с учителем. Получай готовые задания или собирай свои. Описывай сюжетные картинки  и учи языки эффективно с My Texter."
				/>
				<meta
					name="twitter:image"
					content="https://api.my-texter.com/image/my_texter.png"
				/>

				<meta property="og:site_name" content="https://my-texter.com/" />
				<meta property="og:type" content="website" />
				<meta property="og:determiner" content="a" />
				<meta property="og:title" content="My Texter" />
				<meta
					property="og:description"
					content="Учись  сам  или с учителем. Получай готовые задания или собирай свои. Описывай сюжетные картинки  и учи языки эффективно с My Texter."
				/>
				<meta
					property="og:image"
					content="https://api.my-texter.com/image/my_texter.png"
				/>
			</Head>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.backgroundBanner}>
						<Image
							src="/images/index_bg_desktop.png"
							alt="My Texter"
							width={919}
							height={824}
						/>
					</div>
					<div className={styles.backgroundBannerMobile}>
						<Image
							src="/images/index_bg_mobile.png"
							alt="My Texter"
							width={487}
							height={355}
						/>
					</div>
					<div className={styles.shadowBlock}></div>
					<div className={styles.header}>
						<Link href="/">
							<a className={styles.logoLink}>
								<Image
									src="/images/logo.svg"
									alt="My Texter logo"
									width={190}
									height={68}
								/>
							</a>
						</Link>
						<Link href="/auth/login">
							<a className={styles.loginButton}>Войти</a>
						</Link>
					</div>
					<div className={styles.content}>
						<h1>
							<span>My Texter</span> <br />
							сервис обучения <br />
							английскому языку
						</h1>
						<div className={styles.subtitle}>Описывай картинки и учи язык!</div>
						<div className={styles.formContainer}>
							<div className={styles.formTitle}>
								Подпишись на обновления,
								<br /> и мы сообщим о дате запуска сервиса.
							</div>
							{sent ? (
								<div className={styles.successSendingForm}>
									Поздравляем! Вы успешно подписались и сможете быть вкурсе всех
									обновлений My Texter.
									<span onClick={handleClose}>
										<CloseIcon />
									</span>
								</div>
							) : (
								<form
									noValidate
									className={styles.subscrybeForm}
									onSubmit={handleFormSubmit}
								>
									<Input
										type="email"
										id="email"
										name="email"
										placeholder="example@gmail.com"
										value={email}
										onChange={onChange}
										onBlur={handleCheckErrors}
										error={!!error}
									/>
									{error && <div className={styles.formError}>{error}</div>}
									<button
										className={styles.formButton}
										type="submit"
										disabled={loader ? true : false}
									>
										{!loader ? (
											"Подписаться"
										) : (
											<div className={styles.loaderContainer}>
												<Loader image="/images/loader.svg" />
											</div>
										)}
									</button>
								</form>
							)}
						</div>
						<div className={styles.info}>
							Обучения с использованием картинок является одним из эффективных
							способов обучения, который активизирует память, мышление и
							воображение учащихся
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
// 	const token = req.cookies.token || "";
// 	let user = null;

// 	if (token) {
// 		const res = await fetch(
// 			`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
// 			{
// 				headers: { Authorization: `Bearer ${token}` },
// 			}
// 		);

// 		if (res.ok) {
// 			user = await res.json();
// 		}
// 	}

// 	return {
// 		props: {
// 			user: user,
// 		},
// 	};
// };
