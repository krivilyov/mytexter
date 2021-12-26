import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Login.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button } from "@mui/material";
import Input from "../components/input";
import { GetServerSideProps } from "next";

const Login: NextPage = () => {
	const router = useRouter();

	const [values, setValues] = useState({
		email: "",
		password: "",
	});

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value.trim() });
	};

	const errors = {
		email: {
			wrong: "It should be a valid email address",
		},
		password: {
			wrong:
				"Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character.",
		},
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

		if (!emailError && !passwordError) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
					{
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

	interface Errors {
		email: string;
		password: string;
	}

	const handleErrorForm = (errors: Errors) => {
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
				<form onSubmit={handleFormSubmit}>
					<h1>Sign in</h1>
					<div className={styles.formGroup}>
						<label className="form-label" htmlFor="email">
							E-mail
						</label>
						<Input
							type="text"
							id="email"
							name="email"
							value={values.email}
							onChange={onChange}
							onBlur={handleCheckErrors}
						/>
						{emailError && (
							<span className={styles.formError}>{emailError}</span>
						)}
					</div>
					<div className={styles.formGroup}>
						<label className="form-label" htmlFor="password">
							Password
						</label>
						<Input
							type="password"
							id="password"
							name="password"
							value={values.password}
							onChange={onChange}
							onBlur={handleCheckErrors}
						/>
						{passwordError && (
							<span className={styles.formError}>{passwordError}</span>
						)}
					</div>
					<Button variant="contained" type="submit">
						Login
					</Button>
				</form>
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
