import { UserDocument, TopicsData } from "../../../interfaces/interfaces";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { errors } from "../../../lib/messages";
import axios from "axios";
import { useRouter } from "next/router";
import AlertComponent from "../AlertComponent";
import { AlertColor } from "@mui/material/Alert";

import styles from "../../../styles/admin/topic/TopicCreateForm.module.scss";

interface TopicCreateFormProps {
	user: UserDocument;
	topic?: TopicsData;
}

const TopicCreateForm = (props: TopicCreateFormProps) => {
	const { user, topic } = props;
	const router = useRouter();

	const [title, setTitle] = useState(topic ? topic.title : "");
	const [titleError, setTitleError] = useState<string | null>(null);

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
			if (topic) {
				axios
					.put(
						`${process.env.NEXT_PUBLIC_API_URL}/api/topic/${topic.id}`,
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
						}
					});
			} else {
				axios
					.post(
						`${process.env.NEXT_PUBLIC_API_URL}/api/topic`,
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
					.then((res) => router.push("/admin/topics"))
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

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setTitle(e.target.value);
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
							if (title.length < 1) {
								setTitleError(errors.field.empty);
							}

							if (title.length > 0) {
								setTitleError(null);
							}
						}}
						error={titleError ? true : false}
						helperText={titleError ? titleError : ""}
						value={title}
					/>
				</div>
				<Button type="submit" variant="contained" startIcon={<SaveIcon />}>
					Save
				</Button>
			</Box>
		</>
	);
};

export default TopicCreateForm;
