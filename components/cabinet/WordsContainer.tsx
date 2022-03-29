import { WordsData } from "../../interfaces/interfaces";
import WordCard from "./WordCard";

import styles from "../../styles/cabinet/Words.module.scss";

interface WordsContainerProps {
  words: WordsData[];
}

export default function WordsContainer(props: WordsContainerProps) {
  const { words } = props;
  return (
    <div className={styles.wordsContainer}>
      <div className={styles.wordWrapper}>
        {words.map((word) => (
          <WordCard word={word} key={word.id} />
        ))}
      </div>
    </div>
  );
}
