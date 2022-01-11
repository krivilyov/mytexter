import { UserDocument, LanguagesData } from "../../../interfaces/interfaces";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { errors } from "../../../lib/messages";
import AlertComponent from "../AlertComponent";
import { AlertColor } from "@mui/material/Alert";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";

import styles from "../../../styles/admin/language/LanguageUpdateForm.module.scss";

interface LanguageUpdateProps {
	user: UserDocument;
	language: LanguagesData;
}

const LanguageUpdateForm = (props: LanguageUpdateProps) => {
	const { user, language } = props;

	const [languageData, setLanguageData] = useState(language);
	const [titleError, setTitleError] = useState<string | null>(null);
	const [checked, setChecked] = useState(language.isActive ? true : false);

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

		setAlertValues({ ...alertValues, show: false });

		const validate = formValidate();

		if (validate) {
			axios
				.put(
					`${process.env.NEXT_PUBLIC_API_URL}/api/language/${language.id}`,
					{
						title: languageData.title,
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

					setLanguageData(res.data);
				})
				.catch((error) => {
					if (error.response) {
						handleErrorForm(error.response.data);
					}
				});
		}
	};

	interface Errors {
		title: string;
	}

	const handleErrorForm = (errors: Errors) => {
		setAlertValues({
			...alertValues,
			show: true,
			type: "error",
			message: `${errors.title}`,
		});

		if (errors.title) {
			setTitleError(errors.title);
		}
	};

	const formValidate = (): boolean => {
		let validateTitle = true;
		if (languageData.title.length < 1) {
			validateTitle = false;
			setTitleError(errors.field.empty);
		}

		if (languageData.title.length > 0) {
			validateTitle = true;
			setTitleError(null);
		}

		if (validateTitle) {
			return true;
		} else {
			return false;
		}
	};

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setLanguageData({
			...languageData,
			[e.target.name]: e.target.value.trim(),
		});
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
						id="alias"
						name="alias"
						label="alias"
						multiline
						fullWidth
						value={languageData.alias}
						disabled
					/>
					<TextField
						className={styles.formGroup}
						id="title"
						name="title"
						label="title"
						multiline
						fullWidth
						onChange={onChange}
						onBlur={() => {
							if (languageData.title.length < 1) {
								setTitleError(errors.field.empty);
							}

							if (languageData.title.length > 0) {
								setTitleError(null);
							}
						}}
						error={titleError ? true : false}
						helperText={titleError ? titleError : ""}
						value={languageData.title}
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
};

export default LanguageUpdateForm;
