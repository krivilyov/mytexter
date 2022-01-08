import { UserDocument } from "../../../interfaces/interfaces";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import styles from "../../../styles/admin/topic/TopicCreateForm.module.scss";
import { useState } from "react";
import { errors } from "../../../lib/messages";
import axios from "axios";
import { useRouter } from "next/router";

interface LevelCreateFormProps {
	user: UserDocument;
}

const LevelCreateForm = (props: LevelCreateFormProps) => {
	const { user } = props;
	const router = useRouter();

	const [title, setTitle] = useState<string>("");
	const [titleError, setTitleError] = useState<string | null>(null);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/level`,
					{
						title: title,
					},
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
						withCredentials: true,
					}
				)
				.then((res) => router.push("/admin/levels"))
				.catch((error) => {
					if (error.response) {
						handleErrorForm(error.response.data);
					}
				});
		}
	};

	const formValidate = (): boolean => {
		let validateTitle = true;
		if (title.length < 1) {
			validateTitle = false;
			setTitleError(errors.field.empty);
		}

		if (title.length > 0) {
			validateTitle = true;
			setTitleError(null);
		}

		if (validateTitle) {
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
		setTitle(e.target.value);
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
						if (title.length < 1) {
							setTitleError(errors.field.empty);
						}

						if (title.length > 0) {
							setTitleError(null);
						}
					}}
					error={titleError ? true : false}
					helperText={titleError ? titleError : ""}
				/>
			</div>
			<Button type="submit" variant="contained" startIcon={<SaveIcon />}>
				Save
			</Button>
		</Box>
	);
};

export default LevelCreateForm;
