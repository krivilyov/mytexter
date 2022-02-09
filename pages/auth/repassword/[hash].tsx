import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Input from "../../../components/input";
import { errors } from "../../../lib/messages";
import Loader from "../../../components/loader";
import { useRouter } from "next/router";
import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";

import styles from "../../../styles/auth/Restore.module.scss";

type RepasswordProps = {
	restoreHash: string;
};

export default function Repassword(props: RepasswordProps) {
	const { restoreHash } = props;

	const router = useRouter();
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loader, isLoader] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleCheckErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputName: string = e.target.name;
		//for password
		if (inputName === "password") {
			const filterPassword =
				/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
			if (!filterPassword.test(String(password).toLowerCase()))
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
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/repassword`,
					{
						password: password,
						restoreHash: restoreHash,
					},
					{ withCredentials: true }
				)
				.then((res) => {
					isLoader(false);
					router.push("/auth/login");
				})
				.catch((error) => {
					if (error.response) {
						handleErrorForm(error.response.data);
					}
				});
		}
	};

	interface Errors {
		password: string;
	}

	const handleErrorForm = (errors: Errors) => {
		isLoader(false);
		if (errors.password) {
			setPasswordError(errors.password);
		}
	};

	const formValidate = (): boolean => {
		let validatePassword = true;

		//for password
		const filterPassword =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
		if (!filterPassword.test(String(password).toLowerCase())) {
			validatePassword = false;
			setPasswordError(errors.password.wrong);
		} else setPasswordError("");

		if (validatePassword) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<>
			<Head>
				<title>Restore password page</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.heroContainer}>
						<div className={styles.logoContainer}>
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
						<div className={styles.heroText}>Укажите новый пароль</div>
					</div>
					<div className={styles.formWrap}>
						{passwordError ? (
							<div className={styles.errorContainer}>
								{passwordError && (
									<div className={styles.errorItem}>{passwordError}</div>
								)}
							</div>
						) : (
							""
						)}
						<form onSubmit={handleFormSubmit}>
							<Input
								type="password"
								id="password"
								name="password"
								value={password}
								onChange={onChange}
								onBlur={handleCheckErrors}
								loader={loader}
								placeholder="Password"
								autocomplete="off"
							/>

							<button
								className={styles.formButton}
								type="submit"
								disabled={loader ? true : false}
							>
								{!loader ? (
									"Ок"
								) : (
									<div className={styles.loaderContainer}>
										<Loader image="/images/loader.svg" />
									</div>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	let user = null;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/auth/amnesia-user/${query.hash}`
	);

	if (res.ok) {
		user = await res.json();
	}

	if (!user) {
		return {
			redirect: {
				destination: "/auth/restore",
				statusCode: 302,
			},
		};
	}

	return {
		props: {
			restoreHash: user.restoreHash,
		},
	};
};
