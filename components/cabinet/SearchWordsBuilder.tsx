import { WordsData, UserDocument } from "../../interfaces/interfaces";
import Image from "next/image";
import RemoveIcon from "@mui/icons-material/Remove";
import Loader from "../../components/loader";

import styles from "../../styles/cabinet/SearchWordsBuilder.module.scss";

interface TaskBuilderProps {
	userInfo: UserDocument;
	wordsInTask: WordsData[];
	handleCardRemoveFromTask: (word: WordsData) => void;
	loader: boolean;
	saveBtnLoader: boolean;
	showSaveBtn: boolean;
	isSaved: boolean;
	btnSubmitSaveWords: () => void;
}

export default function SearchWordsBuilder(props: TaskBuilderProps) {
	const {
		userInfo,
		wordsInTask,
		handleCardRemoveFromTask,
		loader,
		saveBtnLoader,
		showSaveBtn,
		isSaved,
		btnSubmitSaveWords,
	} = props;

	return (
		<>
			<div className={styles.searchedWordsTopBorder}></div>
			<div className={styles.searchedWordsMainContainer}>
				<div className={styles.searchedWordsBtnCreateContainer}>
					<div className={styles.searchedWordsTitle}>Слова для задания:</div>
					{showSaveBtn && (
						<div
							className={`${styles.filterBtnSave} ${
								isSaved ? styles.btnDisabled : ""
							}`}
							onClick={() => {
								btnSubmitSaveWords();
							}}
						>
							{!saveBtnLoader ? (
								!isSaved ? (
									"Сохранить"
								) : (
									"Сохранено"
								)
							) : (
								<div className={styles.loaderContainer}>
									<Loader image="/images/loader.svg" />
								</div>
							)}
						</div>
					)}
				</div>

				{wordsInTask.length ? (
					<ul className={styles.searchedWordsList}>
						{wordsInTask.map((word) => (
							<li className={styles.wordsItem} key={word.id}>
								<div className={styles.shortCard}>
									<div
										className={styles.removeFromTaskBtn}
										onClick={() => handleCardRemoveFromTask(word)}
									>
										<RemoveIcon />
									</div>
									<div className={styles.inageContainer}>
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
										<div className={styles.shortCardTranscription}>
											{word.transcription}
										</div>
									)}
									<div className={styles.searchedWordsContainer}>
										<div className={styles.searchedMainWordWrap}>
											<div className={styles.searchedWordLanguageFlag}>
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
											<div className={styles.searchedMainWord}>
												{word.title}
											</div>
										</div>
										<div className={styles.searchedTransWordWrap}>
											<div className={styles.searchedWordLanguageFlag}>
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
											<div className={styles.searchedTransWord}>
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
									<div className={styles.searchedBtnContainer}>
										<div className={styles.searchedLevelLable}>
											{word.level.title}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				) : (
					<div>No results</div>
				)}
			</div>
		</>
	);
}
