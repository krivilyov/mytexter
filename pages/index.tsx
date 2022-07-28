import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Input from "../components/input";
import Loader from "../components/loader";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import LanguageSwitcher from "../components/language-switcher";
import { GetServerSideProps } from "next";
import { UserDocument } from "../interfaces/interfaces";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";

import styles from "../styles/MainPage.module.scss";

interface HomeProps {
	userInfo?: UserDocument;
}

export default function Home(props: HomeProps) {
	const { userInfo } = props;
	const { t } = useTranslation();

	const [loader, isLoader] = useState(false);
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const router = useRouter();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value.trim());
	};

	const handleCheckErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (email.length) {
			const filterEmail =
				/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filterEmail.test(String(email).toLowerCase()))
				setError(t("home:error-email-wrong"));
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
				setError(t("home:error-email-wrong"));
			} else setError("");
		} else {
			validateEmail = false;
			setError(t("home:empty-field"));
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

	const handleLogaut = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
				{},
				{
					withCredentials: true,
				}
			)
			.then((res) => router.push("/"))
			.catch((error) => {
				if (error.response) {
					console.log(error.response);
				}
			});
	};

	return (
		<>
			<Head>
				<title>My Texter</title>
				<meta name="description" content={t("home:metadescription")}></meta>
				<meta name="keywords" content={t("home:metakeywords")}></meta>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content="https://my-texter.com/" />
				<meta name="twitter:title" content="My Texter" />
				<meta name="twitter:description" content={t("home:metadescription")} />
				<meta
					name="twitter:image"
					content="https://api.my-texter.com/image/my_texter.png"
				/>

				<meta property="og:site_name" content="https://my-texter.com/" />
				<meta property="og:type" content="website" />
				<meta property="og:determiner" content="a" />
				<meta property="og:title" content="My Texter" />
				<meta property="og:description" content={t("home:metadescription")} />
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
									width={300}
									height={140}
								/>
							</a>
						</Link>
						<div className={styles.headerMenuContainer}>
							<LanguageSwitcher />
							{!userInfo ? (
								<Link href="/auth/login">
									<a className={styles.loginButton}>{t("home:login")}</a>
								</Link>
							) : (
								<>
									<Link href="/cabinet/task-builder">
										<a className={styles.userAvatar}>
											<Image
												src={
													userInfo.avatar
														? `${process.env.NEXT_PUBLIC_API_URL}/${userInfo.avatar}`
														: "/images/empty_avatar.jpg"
												}
												alt="Avatar logo"
												width={50}
												height={50}
											/>
										</a>
									</Link>
									<div className={styles.logout} onClick={handleLogaut}>
										<LogoutIcon />
									</div>
								</>
							)}
						</div>
					</div>
					<div className={styles.content}>
						<h1>
							<Trans
								i18nKey="home:title-with-html"
								components={[<span></span>, <br />, <br />]}
							/>
						</h1>
						<div className={styles.subtitle}>{t("home:subtitle")}</div>
						<div className={styles.formContainer}>
							<div className={styles.formTitle}>
								<Trans
									i18nKey="home:form-title-with-html"
									components={[<span></span>]}
								/>
							</div>
							{sent ? (
								<div className={styles.successSendingForm}>
									{t("home:success-sending-form")}
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
											t("home:subscribe-button")
										) : (
											<div className={styles.loaderContainer}>
												<Loader image="/images/loader.svg" />
											</div>
										)}
									</button>
								</form>
							)}
						</div>
						<div className={styles.info}>{t("home:info")}</div>
					</div>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const token = req.cookies.token || "";
	let user = null;
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
		}
	}

	if (user) {
		//get user info
		const resUI = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (resUI.ok) {
			userInfo = await resUI.json();
		}
	}

	return {
		props: {
			userInfo: userInfo,
		},
	};
};
