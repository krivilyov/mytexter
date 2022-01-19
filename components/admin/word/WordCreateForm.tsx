import {
	UserDocument,
	LanguagesData,
	TopicsData,
	LevelsData,
	WordsData,
} from "../../../interfaces/interfaces";
import Box from "@mui/material/Box";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import React, {
	useEffect,
	useState,
	useRef,
	MouseEventHandler,
	MouseEvent,
} from "react";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { errors } from "../../../lib/messages";
import { useRouter } from "next/router";

import styles from "../../../styles/admin/word/WordCreateForm.module.scss";

interface WordCreateFormProps {
	user: UserDocument;
	languages: LanguagesData[];
	topics: TopicsData[];
	levels: LevelsData[];
}

export default function WordCreateForm(props: WordCreateFormProps) {
	const { user, languages, topics, levels } = props;
	const router = useRouter();

	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>();
	const [isSearchShow, setIsSearchShow] = useState(false);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState<WordsData[]>([]);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [translates, setTranslates] = useState<WordsData[]>([]);

	const searchRef = useRef<HTMLDivElement>(null);

	const [values, setValues] = useState({
		title: "",
		transcription: "",
		language_id: 1,
		topic_id: 1,
		level_id: 1,
		description: "",
		prem_description: "",
		image: image,
		is_active: false,
		is_phrase: false,
	});

	const [titleError, setTitleError] = useState<string | null>(null);

	const onChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
	) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [event.target.name]: event.target.checked });
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validate = formValidate();

		if (validate) {
			const data = new FormData();
			const file = values.image ? values.image : "";
			data.append("title", values.title);
			data.append("transcription", values.transcription);
			data.append("language_id", values.language_id.toString());
			data.append("topic_id", values.topic_id.toString());
			data.append("level_id", values.level_id.toString());
			data.append("description", values.description);
			data.append("prem_description", values.prem_description);
			const is_active = values.is_active ? "1" : "0";
			const is_phrase = values.is_phrase ? "1" : "0";
			data.append("is_active", is_active);
			data.append("is_phrase", is_phrase);
			data.append("translations", "");
			data.append("file", file);

			axios
				.post(`${process.env.NEXT_PUBLIC_API_URL}/api/word`, data, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
					withCredentials: true,
				})
				.then((res) => router.push("/admin/words"))
				.catch((error) => {
					if (error.response) {
						console.log(error.response.data);
					}
				});
		}
	};

	const formValidate = (): boolean => {
		let validateTitle = true;

		if (values.title.length < 1) {
			validateTitle = false;
			setTitleError(errors.field.empty);
		}

		if (values.title.length > 0) {
			validateTitle = true;
			setTitleError(null);
		}

		if (validateTitle) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		if (!isSearchShow) {
			return;
		}

		function handleClickOutside(event: any) {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsSearchShow(false);
				setShowSearchResult(false);
				setSearch("");
				setSearchResult([]);
			}
		}

		document.addEventListener("click", handleClickOutside, true);
		return () =>
			document.removeEventListener("click", handleClickOutside, true);
	}, [isSearchShow]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const handleSearching = () => {
		const formattedSearch = search.toLowerCase();
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/word?query=${formattedSearch}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
					withCredentials: true,
				}
			)
			.then((res) => {
				setSearchResult(res.data);
				setShowSearchResult(true);
			})
			.catch((error) => {
				if (error.response) {
					console.log(error.response);
				}
			});
	};

	const handleSerchedWordClick = (e: MouseEvent<HTMLElement>) => {
		const currentWordId = Number(e.currentTarget.getAttribute("data-id"));
		const currentWord = searchResult.find(
			(word: WordsData) => word.id === currentWordId
		);

		if (currentWord) {
			const isContain = translates.filter(
				(word: WordsData) => word.id === currentWord.id
			);

			if (isContain.length < 1) {
				setTranslates([...translates, currentWord]);

				//matation for ad isClicked - for change color using translate
				let newSearchResult = searchResult.map((el) =>
					el.id === currentWord.id ? { ...el, isClicked: true } : el
				);
				setSearchResult(newSearchResult);
			}
		}
	};

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

	const handleTranslateItemDelete = (translate: WordsData) => {
		//delete from translates
		const index = translates.indexOf(translate);
		translates.splice(index, 1);
		setTranslates(translates);

		//add to searchResult
		let newSearchResult = searchResult.map((el) =>
			el.id === translate.id ? { ...el, isClicked: false } : el
		);
		setSearchResult(newSearchResult);
	};

	return (
		<Box
			component="form"
			className={styles.form}
			autoComplete="on"
			onSubmit={handleFormSubmit}
		>
			<Box component="div" className={styles.formContainer}>
				<div className={styles.formColumn}>
					<TextField
						className={styles.formGroup}
						id="title"
						name="title"
						label="Title"
						placeholder="Title"
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
						id="transcription"
						name="transcription"
						label="Transcription"
						placeholder="Transcription"
						multiline
						fullWidth
						onChange={onChange}
					/>

					<div className={styles.translateContainer}>
						<div className={styles.translateTitle}>Translations</div>
						<div ref={searchRef} className={styles.translateListContainer}>
							{translates.length > 0 && (
								<ul className={styles.translateList}>
									{translates.map((translate: WordsData) => (
										<li key={translate.id}>
											<div>
												<span className={styles.translateSpanBadge}>
													{translate.language.code}
												</span>
												{translate.title}
											</div>
											<div>
												<DeleteForeverIcon
													color="error"
													fontSize="small"
													onClick={() => handleTranslateItemDelete(translate)}
												/>
											</div>
										</li>
									))}
								</ul>
							)}

							{!isSearchShow ? (
								<Button
									variant="contained"
									color="success"
									size="small"
									startIcon={<AddIcon />}
									onClick={() => setIsSearchShow(true)}
								>
									Add
								</Button>
							) : (
								<div className={styles.searchBlockContainer}>
									<div className={styles.searchBlock}>
										<input
											type="text"
											name="search"
											value={search}
											onChange={handleSearch}
										/>
										<IconButton
											color="primary"
											aria-label="search"
											onClick={handleSearching}
										>
											<SearchIcon />
										</IconButton>
									</div>
									{showSearchResult &&
										(searchResult.length ? (
											<ul className={styles.searchResult}>
												{searchResult.map((word: WordsData) => (
													<li
														key={word.id}
														data-id={word.id}
														onClick={handleSerchedWordClick}
														className={
															word.isClicked ? styles.activeSearchItem : ""
														}
													>
														<span className={styles.translateSpanBadge}>
															{word.language.code}
														</span>
														{word.title}
													</li>
												))}
											</ul>
										) : (
											<div>No results</div>
										))}
								</div>
							)}
						</div>
					</div>

					<div className={styles.chekboxContainer}>
						<div className={styles.formGroup}>
							<label className={styles.lable} htmlFor="is_active">
								Is Active
							</label>
							<Checkbox
								id="is_active"
								name="is_active"
								checked={values.is_active}
								onChange={handleChange}
								inputProps={{ "aria-label": "controlled" }}
							/>
						</div>
						<div className={styles.formGroup}>
							<label className={styles.lable} htmlFor="is_phrase">
								Is Phrase
							</label>
							<Checkbox
								id="is_phrase"
								name="is_phrase"
								checked={values.is_phrase}
								onChange={handleChange}
								inputProps={{ "aria-label": "controlled" }}
							/>
						</div>
					</div>
					<FormControl className={styles.formGroup} fullWidth>
						<InputLabel id="language_id">Language</InputLabel>
						<Select
							labelId="language_id"
							id="language_id"
							name="language_id"
							value={values.language_id.toString()}
							label="Language"
							onChange={onChange}
						>
							{languages.map((language) => (
								<MenuItem key={language.id} value={language.id}>
									{language.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl className={styles.formGroup} fullWidth>
						<InputLabel id="topic_id">Topic</InputLabel>
						<Select
							labelId="topic_id"
							id="topic_id"
							name="topic_id"
							value={values.topic_id.toString()}
							label="Topic"
							onChange={onChange}
						>
							{topics.map((topic) => (
								<MenuItem key={topic.id} value={topic.id}>
									{topic.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl className={styles.formGroup} fullWidth>
						<InputLabel id="level_id">Language level</InputLabel>
						<Select
							labelId="level_id"
							id="level_id"
							name="level_id"
							value={values.level_id.toString()}
							label="Language level"
							onChange={onChange}
						>
							{levels.map((level) => (
								<MenuItem key={level.id} value={level.id}>
									{level.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						className={styles.formGroup}
						id="description"
						label="Description"
						name="description"
						placeholder="Description"
						rows={6}
						multiline
						fullWidth
						onChange={onChange}
					/>

					<TextField
						className={styles.formGroup}
						id="prem_description"
						label="Premium Description"
						name="prem_description"
						placeholder="Description"
						rows={6}
						multiline
						fullWidth
						onChange={onChange}
					/>
				</div>
				<div className={styles.formColumn}>
					<div className={styles.imageContainer}>
						<div className={styles.imageWrapper}>
							<Image
								className={styles.image}
								src={preview ? preview : "/images/no_image.png"}
								alt="Empty avatar"
								width={300}
								height={200}
							/>
							<div className={styles.imageDescription}>
								Image 1000x800px (.jpg/.png)
							</div>
						</div>

						<div className={styles.imageDownloadContainer}>
							<label htmlFor="file">
								<DownloadIcon className={styles.imageDownloadIcon} />
							</label>
							<input
								type="file"
								id="file"
								name="image"
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
	);
}
