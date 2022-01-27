import type { NextPage } from "next";
import { useState } from "react";
import styles from "../../styles/auth/Registration.module.scss";
import { GetServerSideProps } from "next";
import Input from "../../components/input";
import { Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { errors } from "../../lib/messages";
import Image from "next/image";
import Link from "next/link";

const Registration: NextPage = () => {
	const router = useRouter();

	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value.trim() });
	};

	const handleCheckErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputName: string = e.target.name;

		//for name
		if (inputName === "name") {
			const filterName = /[a-zA-Z][a-zA-Z0-9-_]{3,10}/;
			if (!filterName.test(String(values.name).toLowerCase()))
				setNameError(errors.name.wrong);
			else setNameError("");
		}

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

	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/registration`,
					{
						name: values.name,
						email: values.email,
						password: values.password,
					},
					{ withCredentials: true }
				)
				.then((res) => router.push("/"))
				.catch((error) => {
					if (error.response) {
						handleErrorForm(error.response.data);
					}
				});
		}
	};

	const formValidate = (): boolean => {
		let validateName = true;
		let validateEmail = true;
		let validatePassword = true;

		//name
		const filterName = /[a-zA-Z][a-zA-Z0-9-_]{3,10}/;
		if (!filterName.test(String(values.name).toLowerCase())) {
			validateName = false;
			setNameError(errors.name.wrong);
		} else setNameError("");

		//email
		const filterEmail =
			/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filterEmail.test(String(values.email).toLowerCase())) {
			validateEmail = false;
			setEmailError(errors.email.wrong);
		} else setEmailError("");

		//password
		const filterPassword =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
		if (!filterPassword.test(String(values.password).toLowerCase())) {
			validatePassword = false;
			setPasswordError(errors.password.wrong);
		} else setPasswordError("");

		if (validateName && validateEmail && validatePassword) {
			return true;
		} else {
			return false;
		}
	};

	interface Errors {
		name: string;
		email: string;
		password: string;
	}

	const handleErrorForm = (errors: Errors) => {
		if (errors.name) {
			setNameError(errors.name);
		}

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
					{nameError || emailError || passwordError ? (
						<div className={styles.errorContainer}>
							{nameError && <div className={styles.errorItem}>{nameError}</div>}
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

					<form className={styles.form} onSubmit={handleFormSubmit}>
						<div className={styles.formGroup}>
							<label className={styles.formLabel} htmlFor="email">
								Ваше имя
							</label>
							<Input
								type="text"
								id="name"
								name="name"
								value={values.name}
								onChange={onChange}
								onBlur={handleCheckErrors}
							/>
						</div>
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
							/>
						</div>

						<div className={styles.serviceLinksContainer}>
							<Link href="/auth/login">
								<a className={styles.recover}>Забыли пароль?</a>
							</Link>
						</div>

						<button className={styles.formButton} type="submit">
							Registration
						</button>
					</form>
				</div>
				<div className={styles.loginLinkContainer}>
					У меня есть аккаунт!
					<Link href="/auth/login">
						<a className={styles.recover}>Войти</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Registration;

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
				destination: "/",
				statusCode: 302,
			},
		};
	}

	return {
		props: {},
	};
};
