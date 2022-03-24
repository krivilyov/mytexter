import { WordsData } from "../../interfaces/interfaces";

import styles from "../../styles/cabinet/Cabinet.module.scss";

interface WordsContainerProps {
  words?: WordsData[];
}

export default function WordsContainer(props: WordsContainerProps) {
  const { words } = props;
  return (
    <div className={styles.wordsContainer}>
      {words?.map((word) => (
        <div key={word.id}>{word.title}</div>
      ))}
    </div>
  );
}
