import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Input from "../components/input";
import Loader from "../components/loader";
import { useState } from "react";
import { errors } from "../lib/messages";

import styles from "../styles/MainPage.module.scss";

export default function Home() {
	const [loader, isLoader] = useState(false);

	return (
		<>
			<Head>
				<title>My Texter</title>
				<meta
					name="description"
					content="My Texter сервис обучения английскому языку"
				></meta>
				<meta name="keywords" content="My Texter, обучение, языки"></meta>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.bannerDesktop}>
						<Image
							src="/images/index_banner.png"
							alt="My Texter"
							width={1526}
							height={1050}
						/>
					</div>
					<div className={styles.header}>
						<Link href="/">
							<a className={styles.logoLink}>
								<Image
									src="/images/logo.svg"
									alt="My Texter logo"
									width={195}
									height={65}
								/>
							</a>
						</Link>
					</div>
					<div className={styles.content}>
						<h1>
							<span>My Texter</span>
							<br /> сервис обучения
							<br /> английскому языку
						</h1>
						<div className={styles.subtitle}>Описывай картинки и учи язык!</div>
						<div className={styles.formContainer}>
							<div className={styles.formTitle}>
								Подпишись на обновления,
								<br /> и мы сообщим о дате запуска сервиса.
							</div>
							<form className={styles.subscrybeForm}>
								<div className={styles.inputContainer}>
									<Input
										type="email"
										id="email"
										name="email"
										placeholder="example@gmail.com"
										value=""
									/>
									<div className={styles.formError}>{errors.email.wrong}</div>
								</div>
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
							<div className={styles.info}>
								Обучения с использованием картинок является одним из эффективных
								способов обучения, который активизирует память, мышление и
								воображение учащихся
							</div>
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
