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

interface WordCardProps {
	word: WordsData;
	type: string;
	task?: TasksData;
	user: UserDocument;
}

export default function WordCard(props: WordCardProps) {
	const { word, type, task, user } = props;

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

		axios
			.get(
				`https://api.voicerss.org/?key=${process.env.NEXT_PUBLIC_VOICE_RSS_KEY}&hl=en-us&v=Amy&b64=true&src=${title}`
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
				{word.transcription.length && (
					<div className={styles.wordTranscription}>{word.transcription}</div>
				)}
				<div className={styles.wordsContainer}>
					<div className={styles.mainWordWrap}>
						<div className={styles.languageFlag}>
							<svg
								viewBox="0 0 20 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<mask
									id="mask0_308_631"
									maskUnits="userSpaceOnUse"
									x="0"
									y="0"
									width="20"
									height="16"
								>
									<rect
										x="0.266602"
										y="0.699707"
										width="19.4667"
										height="14.6"
										fill="white"
									/>
								</mask>
								<g mask="url(#mask0_308_631)">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0.266602 0.699707H19.7333V15.2997H0.266602V0.699707Z"
										fill="#E31D1C"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0.266602 1.9165V3.13317H19.7333V1.9165H0.266602ZM0.266641 4.34982V5.56649H19.7333V4.34982H0.266641ZM0.266641 7.99982V6.78315H19.7333V7.99982H0.266641ZM0.266641 9.21649V10.4332H19.7333V9.21649H0.266641ZM0.266641 12.8665V11.6498H19.7333V12.8665H0.266641ZM0.266641 15.2998V14.0832H19.7333V15.2998H0.266641Z"
										fill="#F7FCFF"
									/>
									<rect
										x="0.266602"
										y="0.699707"
										width="10.95"
										height="8.51667"
										fill="#2E42A5"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M1.5321 3.34421L2.17684 2.8951L2.67696 3.25515H2.39379L2.96644 3.76164L2.77302 4.47181H2.47009L2.17594 3.81956L1.92508 4.47181H1.17712L1.74977 4.97831L1.5321 5.77754L2.17684 5.32843L2.67696 5.68848H2.39379L2.96644 6.19498L2.77302 6.90515H2.47009L2.17594 6.2529L1.92508 6.90515H1.17712L1.74977 7.41164L1.5321 8.21087L2.17684 7.76176L2.80066 8.21087L2.60671 7.41164L3.1077 6.90515H2.87662L3.3935 6.5451L3.89363 6.90515H3.61046L4.1831 7.41164L3.96543 8.21087L4.61017 7.76176L5.234 8.21087L5.04004 7.41164L5.54103 6.90515H5.30995L5.82684 6.5451L6.32696 6.90515H6.04379L6.61644 7.41164L6.39877 8.21087L7.0435 7.76176L7.66733 8.21087L7.47338 7.41164L7.97436 6.90515H7.74328L8.26017 6.5451L8.76029 6.90515H8.47712L9.04977 7.41164L8.8321 8.21087L9.47684 7.76176L10.1007 8.21087L9.90671 7.41164L10.4077 6.90515H9.77009L9.47593 6.2529L9.22508 6.90515H8.86238L8.69004 6.19498L9.19103 5.68848H8.95995L9.47684 5.32843L10.1007 5.77754L9.90671 4.97831L10.4077 4.47181H9.77009L9.47593 3.81956L9.22508 4.47181H8.86238L8.69004 3.76164L9.19103 3.25515H8.95995L9.47684 2.8951L10.1007 3.34421L9.90671 2.54498L10.4077 2.03848H9.77009L9.47593 1.38623L9.22508 2.03848H8.47712L9.04977 2.54498L8.85635 3.25515H8.55342L8.25927 2.6029L8.00841 3.25515H7.64572L7.47338 2.54498L7.97436 2.03848H7.33675L7.0426 1.38623L6.79174 2.03848H6.04379L6.61644 2.54498L6.42302 3.25515H6.12009L5.82594 2.6029L5.57508 3.25515H5.21238L5.04004 2.54498L5.54103 2.03848H4.90342L4.60927 1.38623L4.35841 2.03848H3.61046L4.1831 2.54498L3.98969 3.25515H3.68675L3.3926 2.6029L3.14174 3.25515H2.77905L2.60671 2.54498L3.1077 2.03848H2.47009L2.17594 1.38623L1.92508 2.03848H1.17712L1.74977 2.54498L1.5321 3.34421ZM8.85635 5.68848L9.04977 4.97831L8.47712 4.47181H8.76029L8.26017 4.11176L7.74328 4.47181H7.97436L7.47338 4.97831L7.64572 5.68848H8.00841L8.25927 5.03623L8.55342 5.68848H8.85635ZM7.54363 5.68848L7.0435 5.32843L6.52662 5.68848H6.7577L6.25671 6.19498L6.42905 6.90515H6.79174L7.0426 6.2529L7.33675 6.90515H7.63969L7.8331 6.19498L7.26046 5.68848H7.54363ZM5.39977 6.19498L5.20635 6.90515H4.90342L4.60927 6.2529L4.35841 6.90515H3.99572L3.82338 6.19498L4.32436 5.68848H4.09328L4.61017 5.32843L5.11029 5.68848H4.82712L5.39977 6.19498ZM5.57508 5.68848H5.21238L5.04004 4.97831L5.54103 4.47181H5.30995L5.82684 4.11176L6.32696 4.47181H6.04379L6.61644 4.97831L6.42302 5.68848H6.12009L5.82594 5.03623L5.57508 5.68848ZM3.98969 5.68848L4.1831 4.97831L3.61046 4.47181H3.89363L3.3935 4.11176L2.87662 4.47181H3.1077L2.60671 4.97831L2.77905 5.68848H3.14174L3.3926 5.03623L3.68675 5.68848H3.98969ZM7.8331 3.76164L7.63969 4.47181H7.33675L7.0426 3.81956L6.79174 4.47181H6.42905L6.25671 3.76164L6.7577 3.25515H6.52662L7.0435 2.8951L7.54362 3.25515H7.26046L7.8331 3.76164ZM5.11029 3.25515L4.61017 2.8951L4.09328 3.25515H4.32436L3.82338 3.76164L3.99572 4.47181H4.35841L4.60927 3.81956L4.90342 4.47181H5.20635L5.39977 3.76164L4.82712 3.25515H5.11029Z"
										fill="#F7FCFF"
									/>
								</g>
							</svg>
						</div>
						<div className={styles.mainWord}>{word.title}</div>
					</div>
					<div className={styles.transWordWrap}>
						<div className={styles.languageFlag}>
							<svg
								viewBox="0 0 21 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<mask
									id="mask0_308_617"
									maskUnits="userSpaceOnUse"
									x="0"
									y="0"
									width="21"
									height="15"
								>
									<rect
										x="0.766724"
										y="0.0332031"
										width="19.4667"
										height="14.6"
										fill="white"
									/>
								</mask>
								<g mask="url(#mask0_308_617)">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0.766724 0.0332031V14.6332H20.2334V0.0332031H0.766724Z"
										fill="#3D58DB"
									/>
									<mask
										id="mask1_308_617"
										maskUnits="userSpaceOnUse"
										x="0"
										y="0"
										width="21"
										height="15"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M0.766724 0.0332031V14.6332H20.2334V0.0332031H0.766724Z"
											fill="white"
										/>
									</mask>
									<g mask="url(#mask1_308_617)">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M0.766724 0.0332031V4.89987H20.2334V0.0332031H0.766724Z"
											fill="#F7FCFF"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M0.766724 9.7666V14.6333H20.2334V9.7666H0.766724Z"
											fill="#C51918"
										/>
									</g>
								</g>
							</svg>
						</div>
						<div className={styles.transWord}>
							{word.t_words.length ? word.t_words[0]["title"] : ""}
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
