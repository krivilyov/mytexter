import styles from "../../styles/admin/CreateUser.module.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";

const CreateUser = () => {
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		role: "customer",
		avatar: "/images/empty_avatar.jpg",
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value.trim() });
	};

	const handleChange = (e: SelectChangeEvent) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	return (
		<div className={styles.wrapper}>
			<h1>New User</h1>
			<Box component="form" className={styles.form} autoComplete="off">
				<Box component="div" className={styles.formContainer}>
					<div className={styles.formColumn}>
						<TextField
							className={styles.formGroup}
							id="user-name"
							label="User Name"
							placeholder="User Name"
							error
							helperText="Incorrect entry."
							multiline
							fullWidth
						/>
						<TextField
							className={styles.formGroup}
							id="email"
							label="E-mail"
							placeholder="E-mail"
							type="email"
							multiline
							fullWidth
						/>
						<TextField
							className={styles.formGroup}
							id="outlined-password-input"
							label="Password"
							placeholder="Password"
							type="password"
							fullWidth
						/>

						<FormControl fullWidth>
							<InputLabel id="role">Role</InputLabel>
							<Select
								labelId="role"
								id="role"
								name="role"
								value={values.role}
								label="Role"
								onChange={handleChange}
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
									src={values.avatar}
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
								<input type="file" id="file" style={{ display: "none" }} />
							</div>
						</div>
					</div>
				</Box>

				<Button variant="contained" startIcon={<SaveIcon />}>
					Save
				</Button>
			</Box>
		</div>
	);
};

export default CreateUser;
