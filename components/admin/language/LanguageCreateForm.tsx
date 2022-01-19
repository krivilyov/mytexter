import { UserDocument } from "../../../interfaces/interfaces";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { errors } from "../../../lib/messages";
import axios from "axios";
import { useRouter } from "next/router";
import Checkbox from "@mui/material/Checkbox";

import styles from "../../../styles/admin/language/LanguageCreateForm.module.scss";

interface LanguageCreateFormProps {
	user: UserDocument;
}

export default function LanguageCreateForm(props: LanguageCreateFormProps) {
	const { user } = props;
	const router = useRouter();

	const [values, setValues] = useState({
		title: "",
		code: "",
	});
	const [checked, setChecked] = useState(false);
	const [titleError, setTitleError] = useState<string | null>(null);
	const [codeError, setCodeError] = useState<string | null>(null);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
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
	);
}
