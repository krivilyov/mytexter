import styles from "../../styles/admin/UserCreateForm.module.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import { UserDocument } from "../../interfaces/interfaces";
import { errors } from "../../lib/messages";
import axios from "axios";
import { useRouter } from "next/router";
import AlertComponent from "./AlertComponent";
import { AlertColor } from "@mui/material/Alert";

interface UserUpdateFormProps {
	user: UserDocument;
	currentUser: UserDocument;
}

const UserUpdateForm = (props: UserUpdateFormProps) => {
	const { user, currentUser } = props;

	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>();

	const [values, setValues] = useState({
		name: currentUser.name,
		email: currentUser.email,
		password: "",
		confirmPassword: "",
		role: currentUser.role,
		avatar: image,
	});

	//alert
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<AlertColor>("success");
	const [alertMessage, setAlertMessage] = useState<string>("");

	//for change email
	const oldEmail = currentUser.email;

	const onChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
	) => {
		setValues({ ...values, [e.target.name]: e.target.value.trim() });
	};

	const [nameError, setNameError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState<
		string | null
	>(null);

	useEffect(() => {
		if (image) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(image);
		} else {
			setPreview("");
		}
	}, [image]);

	const formValidate = (): boolean => {
		let validateName = true;
		let validateEmail = true;
		let validatePassword = true;
		let validateConfirmPassword = true;

		//validate name
		const filterName = /[a-zA-Z][a-zA-Z0-9-_]{3,10}/;
		if (!filterName.test(String(values.name).toLowerCase())) {
			validateName = false;
			setNameError(errors.name.wrong);
		} else setNameError(null);

		//validate email
		const filterEmail =
			/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filterEmail.test(String(values.email).toLowerCase())) {
			validateEmail = false;
			setEmailError(errors.email.wrong);
		} else setEmailError(null);

		//validate password
		if (values.password.length > 0) {
			const filterPassword =
				/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
			if (!filterPassword.test(String(values.password).toLowerCase())) {
				validatePassword = false;
				setPasswordError(errors.password.wrong);
			} else setPasswordError(null);

			//validate confirm password
			if (values.password !== values.confirmPassword) {
				validateConfirmPassword = false;
				setConfirmPasswordError(errors.confirmPassword.wrong);
			}
		}

		//validate confirm password
		if (values.confirmPassword.length > 0) {
			if (values.password !== values.confirmPassword) {
				validateConfirmPassword = false;
				setConfirmPasswordError(errors.confirmPassword.wrong);
			} else {
				setPasswordError(null);
				setConfirmPasswordError(null);
			}
			if (values.confirmPassword.length > 0 && values.password.length < 1) {
				validateConfirmPassword = false;
				setPasswordError(errors.password.empty);
			}
		}

		if (values.confirmPassword.length < 1 && values.password.length < 1) {
			setPasswordError(null);
			setConfirmPasswordError(null);
		}

		if (
			validateName &&
			validateEmail &&
			validatePassword &&
			validateConfirmPassword
		) {
			return true;
		} else {
			return false;
		}
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		//close alert
		setShowAlert(false);

		const validate = formValidate();

		if (validate) {
			const data = new FormData();
			const file = image ? image : "";
			data.append("name", values.name);
			data.append("email", values.email);
			//for change email
			data.append("oldEmail", oldEmail);
			data.append("password", values.password);
			data.append("role", values.role);
			data.append("file", file);
			axios
				.put(
					`${process.env.NEXT_PUBLIC_API_URL}/api/user/${currentUser.id}`,
					data,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					}
				)
				.then((res) => {
					//show success alert
					setShowAlert(true);
					setAlertType("success");
					setAlertMessage("Success!");
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
		password: string;
	}

	const handleErrorForm = (errors: Errors) => {
		setShowAlert(true);
		setAlertType("error");
		setAlertMessage(`${errors.email}`);

		if (errors.email) {
			setEmailError(errors.email);
		}
	};

	return (
		<>
			{showAlert && (
				<AlertComponent
					type={alertType}
					message={alertMessage}
					setShowAlert={setShowAlert}
				/>
			)}
			<Box
				component="form"
				className={styles.form}
				autoComplete="off"
				onSubmit={handleFormSubmit}
			>
				<Box component="div" className={styles.formContainer}>
					<div className={styles.formColumn}>
						<TextField
							className={styles.formGroup}
							id="user-name"
							name="name"
							label="User Name"
							placeholder="User Name"
							multiline
							fullWidth
							onChange={onChange}
							onBlur={() => {
								const filterName = /[a-zA-Z][a-zA-Z0-9-_]{3,10}/;
								if (!filterName.test(String(values.name).toLowerCase())) {
									setNameError(errors.name.wrong);
								} else setNameError(null);
							}}
							error={nameError ? true : false}
							helperText={nameError ? nameError : ""}
							value={values.name}
						/>
						<TextField
							className={styles.formGroup}
							id="email"
							name="email"
							label="E-mail"
							placeholder="E-mail"
							type="email"
							multiline
							fullWidth
							onChange={onChange}
							onBlur={() => {
								const filterEmail =
									/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
								if (!filterEmail.test(String(values.email).toLowerCase()))
									setEmailError(errors.email.wrong);
								else setEmailError(null);
							}}
							error={emailError ? true : false}
							helperText={emailError ? emailError : ""}
							value={values.email}
						/>
						<TextField
							className={styles.formGroup}
							id="outlined-password-input"
							name="password"
							label="Password"
							placeholder="Password"
							type="password"
							fullWidth
							onChange={onChange}
							onBlur={() => {
								const filterPassword =
									/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
								if (
									values.password.length > 0 &&
									!filterPassword.test(String(values.password).toLowerCase())
								)
									setPasswordError(errors.password.wrong);
								else setPasswordError(null);
							}}
							error={passwordError ? true : false}
							helperText={passwordError ? passwordError : ""}
						/>

						<TextField
							className={styles.formGroup}
							id="confirm-password-input"
							name="confirmPassword"
							label="Confirm Password"
							placeholder="Confirm Password"
							type="password"
							fullWidth
							onChange={onChange}
							onBlur={(e) => {
								if (values.password !== e.target.value) {
									setConfirmPasswordError(errors.confirmPassword.wrong);
								}
								if (e.target.value.length > 0 && values.password.length < 1) {
									setPasswordError(errors.password.empty);
								}
								if (e.target.value.length < 1 && values.password.length < 1) {
									setPasswordError(null);
									setConfirmPasswordError(null);
								}
							}}
							error={confirmPasswordError ? true : false}
							helperText={confirmPasswordError ? confirmPasswordError : ""}
						/>

						<FormControl fullWidth>
							<InputLabel id="role">Role</InputLabel>
							<Select
								labelId="role"
								id="role"
								name="role"
								value={values.role}
								label="Role"
								onChange={onChange}
							>
								<MenuItem value="customer">Customer</MenuItem>
								<MenuItem value="admin">Admin</MenuItem>
								<MenuItem value="teacher">Teacher</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className={styles.formColumn}>
						<div className={styles.userAvatarContainer}>
							<div className={styles.userAvatarWrapper}>
								<Image
									className={styles.userAvatarImage}
									src={
										preview
											? preview
											: currentUser.avatar
											? `${process.env.NEXT_PUBLIC_API_URL}/${currentUser.avatar}`
											: "/images/empty_avatar.jpg"
									}
									alt="Empty avatar"
									width={300}
									height={300}
								/>
								<div className={styles.userAvatarImageDescription}>
									Image 200x200px (.jpg/.png)
								</div>
							</div>

							<div className={styles.avatarDownloadContainer}>
								<label htmlFor="file">
									<DownloadIcon className={styles.avatarDownloadIcon} />
								</label>
								<input
									type="file"
									id="file"
									name="avatar"
									accept="image/jpeg,image/png"
									style={{ display: "none" }}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const file =
											typeof e.target.files?.length !== "undefined"
												? e.target.files[0]
												: null;

										if (file && file.type.substr(0, 5) === "image") {
											setImage(file);
											setValues({ ...values, [e.target.name]: file });
										}
									}}
								/>
							</div>
						</div>
					</div>
				</Box>

				<Button type="submit" variant="contained" startIcon={<SaveIcon />}>
					Save
				</Button>
			</Box>
		</>
	);
};

export default UserUpdateForm;
