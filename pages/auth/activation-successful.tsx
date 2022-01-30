import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "../../styles/auth/RegSuccessPage.module.scss";

export default function ActivationSuccessful() {
	return (
		<>
			<Head>
				<title>Success activation page</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.infoBg}>
						<div className={styles.logoContainer}>
							<Image
								src="/images/logo.svg"
								alt="My Texter logo"
								width={195}
								height={65}
							/>
						</div>
						<div className={styles.description}>
							Вы успешно активировали Ваш аккаунт на сайте{" "}
							<span className={styles.bold}>My Texter</span>.
						</div>
						<div className={styles.linkContainer}>
							<Link href="/">
								<a>На главную</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
