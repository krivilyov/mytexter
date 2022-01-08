import { UserDocument, TopicsData } from "../../../interfaces/interfaces";
import styles from "../../../styles/admin/topic/TopicUpdateForm.module.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { errors } from "../../../lib/messages";
import AlertComponent from "../AlertComponent";
import { AlertColor } from "@mui/material/Alert";
import axios from "axios";

interface TopicUpdateFormProps {
	user: UserDocument;
	topic: TopicsData;
}

const TopicUpdateForm = (props: TopicUpdateFormProps) => {
	const { user, topic } = props;

	const [topicData, setTopicData] = useState(topic);
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
			axios
				.put(
					`${process.env.NEXT_PUBLIC_API_URL}/api/topic/${topic.id}`,
					{
						title: topicData.title,
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

					setTopicData(res.data);
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
		if (topicData.title.length < 1) {
			validateTitle = false;
			setTitleError(errors.field.empty);
		}

		if (topicData.title.length > 0) {
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
		setTopicData({ ...topicData, [e.target.name]: e.target.value.trim() });
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
						value={topicData.alias}
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
							if (topicData.title.length < 1) {
								setTitleError(errors.field.empty);
							}

							if (topicData.title.length > 0) {
								setTitleError(null);
							}
						}}
						error={titleError ? true : false}
						helperText={titleError ? titleError : ""}
						value={topicData.title}
					/>
				</div>
				<Button type="submit" variant="contained" startIcon={<SaveIcon />}>
					Save
				</Button>
			</Box>
		</>
	);
};

export default TopicUpdateForm;
