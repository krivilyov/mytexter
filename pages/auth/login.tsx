import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import Input from "../../components/input";
import Image from "next/image";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { errors } from "../../lib/messages";
import Loader from "../../components/loader";

import styles from "../../styles/auth/AuthForm.module.scss";

const Login: NextPage = () => {
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

	const handleCheckErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputName: string = e.target.name;

		//for email
		if (inputName === "email") {
			const filterEmail =
				/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filterEmail.test(String(values.email).toLowerCase()))
				setEmailError(errors.email.wrong);
			else setEmailError("");
		}

		//for password
		if (inputName === "password") {
			const filterPassword =
				/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
			if (!filterPassword.test(String(values.password).toLowerCase()))
				setPasswordError(errors.password.wrong);
			else setPasswordError("");
		}
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
					router.push("/");
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
			setEmailError(errors.email.wrong);
		} else setEmailError("");

		//for password
		const filterPassword =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
		if (!filterPassword.test(String(values.password).toLowerCase())) {
			validatePassword = false;
			setPasswordError(errors.password.wrong);
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
						<Image
							src="/images/logo.svg"
							alt="My Texter logo"
							width={195}
							height={65}
						/>
					</div>
					<div className={styles.heroText}>
						С возвращением, введите свои данные для входа
					</div>
				</div>
				<div className={styles.formWrap}>
					{emailError || passwordError ? (
						<div className={styles.errorContainer}>
							{emailError && (
								<div className={styles.errorItem}>{emailError}</div>
							)}
							{passwordError && (
								<div className={styles.errorItem}>{passwordError}</div>
							)}
						</div>
					) : (
						""
					)}
					<form onSubmit={handleFormSubmit}>
						<div className={styles.formGroup}>
							<label className={styles.formLabel} htmlFor="email">
								Ваш адрес эл. почты
							</label>
							<Input
								type="text"
								id="email"
								name="email"
								value={values.email}
								onChange={onChange}
								onBlur={handleCheckErrors}
								loader={loader}
							/>
						</div>
						<div className={styles.formGroup}>
							<label className={styles.formLabel} htmlFor="password">
								Пароль
							</label>
							<Input
								type="password"
								id="password"
								name="password"
								value={values.password}
								onChange={onChange}
								onBlur={handleCheckErrors}
								loader={loader}
							/>
						</div>

						<div className={styles.serviceLinksContainer}>
							<Link href="/auth/restore">
								<a className={styles.recover}>Забыли пароль?</a>
							</Link>
						</div>

						<button
							className={styles.formButton}
							type="submit"
							disabled={loader ? true : false}
						>
							{!loader ? (
								"Войти"
							) : (
								<div className={styles.loaderContainer}>
									<Loader image="/images/loader.svg" />
								</div>
							)}
						</button>
					</form>
				</div>
				<div className={styles.loginLinkContainer}>
					У меня нет аккаунта!
					<Link href="/auth/registration">
						<a className={styles.recover}>Создать</a>
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
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.ok) {
			user = await res.json();
		}
	}

	if (user) {
		return {
			redirect: {
				destination: "/",
				statusCode: 302,
			},
		};
	}

	return {
		props: {},
	};
};
