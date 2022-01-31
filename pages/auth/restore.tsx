import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Input from "../../components/input";
import { errors } from "../../lib/messages";
import Loader from "../../components/loader";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../../styles/auth/Restore.module.scss";

export default function Restore() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [loader, isLoader] = useState(false);

	const handleCheckErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputName: string = e.target.name;

		//for email
		if (inputName === "email") {
			const filterEmail =
				/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filterEmail.test(String(email).toLowerCase()))
				setEmailError(errors.email.wrong);
			else setEmailError("");
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			//loader
			isLoader(true);

			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/restore`,
					{
						email: email,
					},
					{ withCredentials: true }
				)
				.then((res) => {
					isLoader(false);
					router.push("/auth/restore-success");
				})
				.catch((error) => {
					if (error.response) {
						handleErrorForm(error.response.data);
					}
				});
		}
	};

	interface Errors {
		email: string;
	}

	const handleErrorForm = (errors: Errors) => {
		isLoader(false);
		if (errors.email) {
			setEmailError(errors.email);
		}
	};

	const formValidate = (): boolean => {
		let validateEmail = true;

		//for email
		const filterEmail =
			/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filterEmail.test(String(email).toLowerCase())) {
			validateEmail = false;
			setEmailError(errors.email.wrong);
		} else setEmailError("");

		if (validateEmail) {
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
							<Image
								src="/images/logo.svg"
								alt="My Texter logo"
								width={195}
								height={65}
							/>
						</div>
						<div className={styles.heroText}>
							Для восстановления пароля введите адрес электронной почты
						</div>
					</div>
					<div className={styles.formWrap}>
						{emailError ? (
							<div className={styles.errorContainer}>
								{emailError && (
									<div className={styles.errorItem}>{emailError}</div>
								)}
							</div>
						) : (
							""
						)}
						<form onSubmit={handleFormSubmit}>
							<Input
								type="text"
								id="email"
								name="email"
								value={email}
								onChange={onChange}
								onBlur={handleCheckErrors}
								loader={loader}
								placeholder="Email"
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
