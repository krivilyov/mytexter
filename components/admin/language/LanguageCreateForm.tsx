import { UserDocument, LanguagesData } from "../../../interfaces/interfaces";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { errors } from "../../../lib/messages";
import axios from "axios";
import { useRouter } from "next/router";
import Checkbox from "@mui/material/Checkbox";
import AlertComponent from "../AlertComponent";
import { AlertColor } from "@mui/material/Alert";

import styles from "../../../styles/admin/language/LanguageCreateForm.module.scss";

interface LanguageCreateFormProps {
	user: UserDocument;
	language?: LanguagesData;
}

export default function LanguageCreateForm(props: LanguageCreateFormProps) {
	const { user, language } = props;
	const router = useRouter();

	const [values, setValues] = useState({
		title: language ? language.title : "",
		code: language ? language.code : "",
	});
	const [checked, setChecked] = useState(
		language && language.isActive ? true : false
	);
	const [titleError, setTitleError] = useState<string | null>(null);
	const [codeError, setCodeError] = useState<string | null>(null);

	//alert
	type alertValues = {
		show: boolean;
		type: AlertColor;
		message: string;
	};

	const [alertValues, setAlertValues] = useState<alertValues>({
		show: false,
		type: "success",
		message: "",
	});

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			if (language) {
				axios
					.put(
						`${process.env.NEXT_PUBLIC_API_URL}/api/language/${language.id}`,
						{
							title: values.title,
							code: values.code,
							isActive: checked ? 1 : 0,
						},
						{
							headers: {
								Authorization: `Bearer ${user.token}`,
							},
							withCredentials: true,
						}
					)
					.then((res) => {
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
							setAlertValues({
								...alertValues,
								show: true,
								type: "error",
								// message: `${error.response.data}`,
								message: "Error 500. We have problem on server",
							});
						}
					});
			} else {
				axios
					.post(
						`${process.env.NEXT_PUBLIC_API_URL}/api/language`,
						{
							title: values.title,
							code: values.code,
							isActive: checked ? 1 : 0,
						},
						{
							headers: {
								Authorization: `Bearer ${user.token}`,
							},
							withCredentials: true,
						}
					)
					.then((res) => router.push("/admin/languages"))
					.catch((error) => {
						if (error.response) {
							handleErrorForm(error.response.data);
						}
					});
			}
		}
	};

	const formValidate = (): boolean => {
		let validateTitle = true;
		let validateCode = true;

		if (values.title.length < 1) {
			validateTitle = false;
			setTitleError(errors.field.empty);
		}

		if (values.title.length > 0) {
			validateTitle = true;
			setTitleError(null);
		}

		if (values.code.length < 1) {
			validateCode = false;
			setCodeError(errors.field.empty);
		}

		if (values.code.length > 0) {
			validateCode = true;
			setCodeError(null);
		}

		if (validateTitle && validateCode) {
			return true;
		} else {
			return false;
		}
	};

	interface Errors {
		title: string;
	}

	const handleErrorForm = (errors: Errors) => {
		if (errors.title) {
			setTitleError(errors.title);
		}
	};

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setValues({ ...values, [e.target.name]: e.target.value.trim() });
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
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
				<div className={styles.formContainer}>
					<TextField
						className={styles.formGroup}
						id="title"
						name="title"
						label="title"
						multiline
						fullWidth
						onChange={onChange}
						onBlur={() => {
							if (values.title.length < 1) {
								setTitleError(errors.field.empty);
							}

							if (values.title.length > 0) {
								setTitleError(null);
							}
						}}
						error={titleError ? true : false}
						helperText={titleError ? titleError : ""}
						value={values.title}
					/>

					<TextField
						className={styles.formGroup}
						id="code"
						name="code"
						label="code"
						multiline
						fullWidth
						onChange={onChange}
						onBlur={() => {
							if (values.code.length < 1) {
								setCodeError(errors.field.empty);
							}

							if (values.code.length > 0) {
								setCodeError(null);
							}
						}}
						error={codeError ? true : false}
						helperText={codeError ? codeError : ""}
						value={values.code}
					/>

					<div className={styles.activeContainer}>
						<div className={styles.activeLable}>Is Active</div>
						<Checkbox
							id="isActive"
							name="isActive"
							checked={checked}
							onChange={handleChange}
							inputProps={{ "aria-label": "controlled" }}
						/>
					</div>
				</div>
				<Button type="submit" variant="contained" startIcon={<SaveIcon />}>
					Save
				</Button>
			</Box>
		</>
	);
}
