import styles from "../../styles/cabinet/WordCard.module.scss";
import Image from "next/image";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useState } from "react";
import {
	WordsData,
	TasksData,
	UserDocument,
} from "../../interfaces/interfaces";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import Loader from "../../components/loader";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

interface WordCardProps {
	word: WordsData;
	type: string;
	task?: TasksData;
	user: UserDocument;
	userInfo: UserDocument;
	handleCardAddToTask: (word: WordsData) => void;
}

export default function WordCard(props: WordCardProps) {
	const { word, type, task, user, userInfo, handleCardAddToTask } = props;

	const [openExample, setOpenExample] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [cardValues, setCardValues] = useState({
		taskId: task ? task.id : null,
		wordId: word.id,
		userDescription: word.TaskWords ? word.TaskWords.description : "",
	});
	const [cardActionStates, setCardActionStates] = useState({
		saveActive: false,
		saveLoading: false,
		saveSuccess: cardValues.userDescription ? true : false,
		saveError: false,
	});
	const [isChangeUserDescription, setIsChangeUserDescription] = useState(false);

	const playSoundHandler = (title: string) => {
		//use Voice RSS API
		setIsPlaying(true);

		const langStr =
			type !== "task" ? getLangStr(Number(userInfo.learningLang)) : "en-us";

		axios
			.get(
				`https://api.voicerss.org/?key=${process.env.NEXT_PUBLIC_VOICE_RSS_KEY}&hl=${langStr}&v=Amy&b64=true&src=${title}`
			)
			.then((res) => {
				const audio = new Audio(res.data);
				audio.play();
				audio.onended = () => {
					setIsPlaying(false);
				};
			})
			.catch((error) => console.log(error));
	};

	//lerningLangId = 1 -> EN
	const getLangStr = (lerningLangId: number = 1) => {
		const languagesMap = [
			{ lang_id: 1, voice: "en-us" },
			{ lang_id: 3, voice: "ru-ru" },
			{ lang_id: 7, voice: "fi-fi" },
		];

		let voiceStr = "en-us";

		languagesMap.map((item) => {
			if (item.lang_id === lerningLangId) {
				voiceStr = item.voice;
			}
		});

		return voiceStr;
	};

	const onChangeUserDescriptionHandler = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setCardValues({ ...cardValues, [e.target.name]: e.target.value });
		setCardActionStates({
			...cardActionStates,
			saveActive: true,
			saveSuccess: false,
		});
	};

	const saveUserDescriptionHandler = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		setCardActionStates({
			...cardActionStates,
			saveActive: false,
			saveLoading: true,
		});

		axios
			.put(
				`${process.env.NEXT_PUBLIC_API_URL}/api/task/update-word/`,
				{
					task_id: cardValues.taskId,
					word_id: cardValues.wordId,
					description: cardValues.userDescription,
				},
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
					withCredentials: true,
				}
			)
			.then((res) => {
				setCardActionStates({
					...cardActionStates,
					saveActive: false,
					saveLoading: false,
					saveSuccess: true,
				});
			})
			.catch((error) => {
				console.log(error);
				setCardActionStates({
					...cardActionStates,
					saveLoading: false,
					saveSuccess: false,
					saveError: true,
				});
			});
	};

	return (
		<div className={styles.wordCardWrap}>
			<div className={styles.wordCard}>
				{type === "search-builder" && (
					<div
						className={styles.addToTaskBtn}
						onClick={() => handleCardAddToTask(word)}
					>
						<AddIcon />
					</div>
				)}

				<div className={styles.imageContainer}>
					<Image
						className={styles.image}
						src={
							word.image
								? `${process.env.NEXT_PUBLIC_API_URL}/${word.image}`
								: "/images/empty_word_img.png"
						}
						alt="alt word"
						width={490}
						height={372}
					/>
				</div>
				{word.transcription.length > 0 && (
					<div className={styles.wordTranscription}>{word.transcription}</div>
				)}
				<div className={styles.wordsContainer}>
					<div className={styles.mainWordWrap}>
						<div className={styles.languageFlag}>
							<Image
								className={styles.image}
								src={
									word.language.img
										? `${process.env.NEXT_PUBLIC_API_URL}/${word.language.img}`
										: ""
								}
								alt="alt word"
								width={24}
								height={19}
							/>
						</div>
						<div className={styles.mainWord}>{word.title}</div>
					</div>
					<div className={styles.transWordWrap}>
						<div className={styles.languageFlag}>
							{word.t_words.length > 0 &&
								word.t_words.map((currentWord: WordsData) => {
									if (
										Number(currentWord.language_id) ===
										Number(userInfo.userLang)
									)
										return (
											<Image
												className={styles.image}
												src={
													currentWord.language.img
														? `${process.env.NEXT_PUBLIC_API_URL}/${currentWord.language.img}`
														: ""
												}
												alt="alt word"
												width={24}
												height={19}
											/>
										);
								})}
						</div>
						<div className={styles.transWord}>
							{word.t_words.length > 0 &&
								word.t_words.map((currentWord: WordsData) => {
									if (
										Number(currentWord.language_id) ===
										Number(userInfo.userLang)
									)
										return currentWord.title;
								})}
						</div>
					</div>
				</div>
				<div
					className={`${styles.descriptionContainer} ${
						openExample ? styles.descriptionContainerOpen : ""
					}`}
				>
					<div
						className={styles.description}
						onClick={() => setOpenExample(!openExample)}
					>
						Пример
						<svg
							viewBox="0 0 8 5"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6.63765 0.236328L3.95622 2.87216L1.27479 0.236328L0.391602 1.1045L3.95622 4.6085L7.52085 1.1045L6.63765 0.236328Z"
								fill="#585757"
							/>
						</svg>
					</div>
					<div className={styles.descriptionContentContainer}>
						<div className={styles.descriptionContent}>{word.description}</div>
					</div>
				</div>
				{type === "task" && (
					<div className={styles.userDescriptionContainer}>
						<div className={styles.userDescriptionHeroContainer}>
							<div className={styles.userDescriptionTitle}>
								Ваш вариант <br /> описания изображения
							</div>

							{cardActionStates.saveActive && (
								<a
									href="#"
									className={styles.userDescriptionSaveBtn}
									onClick={saveUserDescriptionHandler}
								>
									<SaveIcon />
								</a>
							)}

							{cardActionStates.saveLoading && (
								<div className={styles.loaderContainer}>
									<Loader image="/images/loader_gray.svg" />
								</div>
							)}

							{cardActionStates.saveSuccess && (
								<div className={styles.successContainer}>
									<CheckCircleIcon />
								</div>
							)}

							{cardActionStates.saveError && (
								<div className={styles.errorContainer}>
									<ErrorIcon />
								</div>
							)}
						</div>
						<textarea
							className={styles.userDescriptionField}
							name="userDescription"
							onChange={onChangeUserDescriptionHandler}
							defaultValue={cardValues.userDescription}
						></textarea>
					</div>
				)}
				<div className={styles.btnContainer}>
					<div className={styles.levelLable}>{word.level.title}</div>
					<div
						className={`${styles.playBtn} ${
							isPlaying ? styles.playBtnDisabled : ""
						}`}
						onClick={() => playSoundHandler(word.title)}
					>
						{isPlaying ? <GraphicEqIcon /> : <VolumeUpIcon />}
						Play
					</div>
				</div>
			</div>
		</div>
	);
}
