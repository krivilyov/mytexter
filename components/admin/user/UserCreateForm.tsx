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
import { UserDocument } from "../../../interfaces/interfaces";
import { errors } from "../../../lib/messages";
import axios from "axios";
import { useRouter } from "next/router";
import AlertComponent from "../AlertComponent";
import { AlertColor } from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";

import styles from "../../../styles/admin/user/UserCreateForm.module.scss";

interface UserCreateFormProps {
	user: UserDocument;
	currentUser?: UserDocument;
}

const UserCreateForm = (props: UserCreateFormProps) => {
	const { user, currentUser } = props;
	const router = useRouter();

	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>();

	const [values, setValues] = useState({
		name: currentUser ? currentUser.name : "",
		email: currentUser ? currentUser.email : "",
		password: "",
		role: currentUser ? currentUser.role : "customer",
		avatar: image,
		isActive: currentUser && currentUser.isActive ? true : false,
	});

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

		if (!currentUser) {
			//validate password
			const filterPassword =
				/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
			if (!filterPassword.test(String(values.password).toLowerCase())) {
				validatePassword = false;
				setPasswordError(errors.password.wrong);
			} else setPasswordError(null);
		}

		if (validateName && validateEmail && validatePassword) {
			return true;
		} else {
			return false;
		}
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			const data = new FormData();
			const file = image ? image : "";
			data.append("name", values.name);
			data.append("email", values.email);
			data.append("password", values.password);
			data.append("role", values.role);
			const isActive = values.isActive ? "1" : "0";
			data.append("isActive", isActive);
			data.append("file", file);

			if (currentUser) {
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
						setAlertValues({
							...alertValues,
							show: true,
							type: "success",
							message: "Updated success",
						});
					})
					.catch((error) => {
						if (error.response) {
							handleErrorForm(error.response.data);
						}
					});
			} else {
				axios
					.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, data, {
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					})
					.then((res) => router.push("/admin/users"))
					.catch((error) => {
						if (error.response) {
							handleErrorForm(error.response.data);
						}
					});
			}
		}
	};

	//alert
	type alertValues = {
		show: boolean;
		type: AlertColor;
		message: string;
	};

	//alert
	const [alertValues, setAlertValues] = useState<alertValues>({
		show: false,
		type: "success",
		message: "",
	});

	interface Errors {
		email: string;
		password: string;
	}

	const handleErrorForm = (errors: Errors) => {
		if (errors.email) {
			setEmailError(errors.email);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [event.target.name]: event.target.checked });
	};

	return (
		<>
			{alertValues.show && (
				<AlertComponent
					alertValues={alertValues}
					setAlertValues={setAlertValues}
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
									console.log(nameError);
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
								if (!filterPassword.test(String(values.password).toLowerCase()))
									setPasswordError(errors.password.wrong);
								else setPasswordError(null);
							}}
							error={passwordError ? true : false}
							helperText={passwordError ? passwordError : ""}
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
						<div className={styles.chekboxContainer}>
							<div className={styles.formGroup}>
								<label className={styles.lable} htmlFor="is_active">
									Is Active
								</label>
								<Checkbox
									id="is_active"
									name="isActive"
									checked={values.isActive}
									onChange={handleChange}
									inputProps={{ "aria-label": "controlled" }}
								/>
							</div>
						</div>
					</div>
					<div className={styles.formColumn}>
						<div className={styles.userAvatarContainer}>
							<div className={styles.userAvatarWrapper}>
								<Image
									className={styles.userAvatarImage}
									src={
										preview
											? preview
											: currentUser && currentUser.avatar
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

export default UserCreateForm;
