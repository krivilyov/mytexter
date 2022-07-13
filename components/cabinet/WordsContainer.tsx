import {
	WordsData,
	TasksData,
	UserDocument,
} from "../../interfaces/interfaces";
import WordCard from "./WordCard";

import styles from "../../styles/cabinet/Words.module.scss";

interface WordsContainerProps {
	words: WordsData[];
	type: string;
	task?: TasksData;
	user: UserDocument;
	handleCardAddToTask?: (word: WordsData) => void;
}

export default function WordsContainer(props: WordsContainerProps) {
	const { words, type, task, user, handleCardAddToTask } = props;

	return (
		<div className={styles.wordsContainer}>
			<div className={styles.wordWrapper}>
				{words.map((word) => (
					<WordCard
						task={task}
						type={type}
						word={word}
						key={word.id}
						user={user}
						handleCardAddToTask={
							typeof handleCardAddToTask !== "undefined"
								? handleCardAddToTask
								: () => {}
						}
					/>
				))}
			</div>
		</div>
	);
}
