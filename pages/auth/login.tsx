import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import Input from "../../components/input";
import Image from "next/image";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Loader from "../../components/loader";
import LanguageSwitcher from "../../components/language-switcher";
import useTranslation from "next-translate/useTranslation";

import styles from "../../styles/auth/AuthForm.module.scss";

const Login: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const [values, setValues] = useState({
		email: "",
		password: "",
	});

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loader, isLoader] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value.trim() });
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			//loader
			isLoader(true);

			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
					{
						email: values.email,
						password: values.password,
					},
					{ withCredentials: true }
				)
				.then((res) => {
					isLoader(false);
					router.push("/cabinet/task-builder");
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
		let validatePassword = true;

		//for email
		const filterEmail =
			/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filterEmail.test(String(values.email).toLowerCase())) {
			validateEmail = false;
			setEmailError(t("auth:wrong-email"));
		} else setEmailError("");

		//for password
		const filterPassword =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
		if (!filterPassword.test(String(values.password).toLowerCase())) {
			validatePassword = false;
			setPasswordError(t("auth:wrong-password"));
		} else setPasswordError("");

		if (validateEmail && validatePassword) {
			return true;
		} else {
			return false;
		}
	};

	interface Errors {
		email: string;
		password: string;
	}

	const handleErrorForm = (errors: Errors) => {
		isLoader(false);
		if (errors.email) {
			setEmailError(errors.email);
		}

		if (errors.password) {
			setPasswordError(errors.password);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.heroContainer}>
					<div className={styles.logoContainer}>
						<Link href="/">
							<a className={styles.logoLink}>
								<Image
									src="/images/logo.svg"
									alt="My Texter logo"
									width={300}
									height={107}
								/>
							</a>
						</Link>
						<LanguageSwitcher />
					</div>
					<div className={styles.heroText}>{t("auth:hero-text-login")}</div>
				</div>
				<div className={styles.formWrap}>
					<form onSubmit={handleFormSubmit}>
						<div className={styles.formGroup}>
							<label className={styles.formLabel} htmlFor="email">
								{t("auth:label-email")}
							</label>
							<Input
								type="text"
								id="email"
								name="email"
								value={values.email}
								onChange={onChange}
								loader={loader}
								error={!!emailError}
							/>
							{emailError && (
								<div className={styles.errorItem}>{emailError}</div>
							)}
						</div>
						<div className={styles.formGroup}>
							<label className={styles.formLabel} htmlFor="password">
								{t("auth:label-password")}
							</label>
							<Input
								type="password"
								id="password"
								name="password"
								value={values.password}
								onChange={onChange}
								loader={loader}
								error={!!passwordError}
							/>
							{passwordError && (
								<div className={styles.errorItem}>{passwordError}</div>
							)}
						</div>

						<div className={styles.serviceLinksContainer}>
							<Link href="/auth/restore">
								<a className={styles.recover}>{t("auth:recover")}</a>
							</Link>
						</div>

						<button
							className={styles.formButton}
							type="submit"
							disabled={loader ? true : false}
						>
							{!loader ? (
								t("auth:form-button")
							) : (
								<div className={styles.loaderContainer}>
									<Loader image="/images/loader.svg" />
								</div>
							)}
						</button>
					</form>
				</div>
				<div className={styles.loginLinkContainer}>
					{t("auth:login-link-container")}
					<Link href="/auth/registration">
						<a className={styles.recover}>{t("auth:create-account")}</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

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
		}
	}

	if (user) {
		return {
			redirect: {
				destination: "/cabinet/task-builder",
				statusCode: 302,
			},
		};
	}

	return {
		props: {},
	};
};
