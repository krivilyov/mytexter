import { GetServerSideProps } from "next";
import {
	UserDocument,
	TopicsData,
	LevelsData,
	WordsData,
	TasksData,
} from "../../interfaces/interfaces";
import Head from "next/head";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";
import FilterBuilder from "../../components/cabinet/FilterBuilder";
import WordsContainer from "../../components/cabinet/WordsContainer";
import { useState, useEffect } from "react";
import SearchWordsBuilder from "../../components/cabinet/SearchWordsBuilder";
import axios from "axios";

import styles from "../../styles/cabinet/Cabinet.module.scss";

interface TaskBuilderProps {
	user: UserDocument;
	userInfo: UserDocument;
	topics: TopicsData[];
	levels: LevelsData[];
	loadWords: WordsData[];
	tasks: TasksData[];
}

export default function TaskBuilder(props: TaskBuilderProps) {
	const { user, userInfo, topics, levels, loadWords, tasks } = props;

	const [words, setWords] = useState(loadWords);
	const [wordsInTask, setWordsInTask] = useState<WordsData[]>([]);
	const [loader, isLoader] = useState(false);
	const [saveBtnLoader, setSaveBtnLoader] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [tasksQuantity, setTasksQuantity] = useState(tasks.length);
	const [cardsType, setCardsType] = useState("builder");

	const [showSaveBtn, setShowSaveBtn] = useState(
		!!words.length || !!wordsInTask.length
	);
	const [searchOpen, setSearchOpen] = useState(false);
	const [query, setQuery] = useState("");

	interface FilterValuesProps {
		quantity: string;
		phrase: string;
		level_id: string;
		topic_id: number;
	}

	const handleFormSubmit = (filterValues: FilterValuesProps) => {
		isLoader(!loader);
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/words/filter?learningLang=${userInfo.learningLang}&topic_id=${filterValues.topic_id}&level_id=${filterValues.level_id}&is_phrase=${filterValues.phrase}&quantity=${filterValues.quantity}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
					withCredentials: true,
				}
			)
			.then((res) => {
				isLoader(false);
				setWords(res.data);
				setIsSaved(false);
				setShowSaveBtn(!!res.data.length);
			})
			.catch((error) => {
				if (error.response) {
					isLoader(false);
					console.log(error.response);
				}
			});
	};

	const handleSaveWords = () => {
		setSaveBtnLoader(!saveBtnLoader);
		const data = {
			user_id: user.id,
			words: words,
		};

		axios
			.post(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, data, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				setSaveBtnLoader(false);
				setTasksQuantity(tasksQuantity + 1);
				setIsSaved(!isSaved);
			})
			.catch((error) => {
				setSaveBtnLoader(false);
				if (error.response) {
					console.log(error.response.data);
				}
			});
	};

	const handleSaveWordsFromSearch = () => {
		setSaveBtnLoader(!saveBtnLoader);
		const data = {
			user_id: user.id,
			words: wordsInTask,
		};

		axios
			.post(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, data, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				setSaveBtnLoader(false);
				setTasksQuantity(tasksQuantity + 1);
				setIsSaved(!isSaved);
			})
			.catch((error) => {
				setSaveBtnLoader(false);
				if (error.response) {
					console.log(error.response.data);
				}
			});
	};

	// Hook
	function useDebounce(value: string, delay: number) {
		// State and setters for debounced value
		const [debouncedValue, setDebouncedValue] = useState(value);
		useEffect(
			() => {
				// Update debounced value after delay
				const handler = setTimeout(() => {
					setDebouncedValue(value);
				}, delay);
				// Cancel the timeout if value changes (also on delay change or unmount)
				// This is how we prevent debounced value from updating if value is changed ...
				// .. within the delay period. Timeout gets cleared and restarted.
				return () => {
					clearTimeout(handler);
				};
			},
			[value, delay] // Only re-call effect if value or delay changes
		);
		return debouncedValue;
	}

	const debouncedSearchTerm = useDebounce(query, 500);

	useEffect(() => {
		const query = debouncedSearchTerm.trim();

		if (query.length >= 3) {
			axios
				.get(`${process.env.NEXT_PUBLIC_API_URL}/api/words/query`, {
					params: {
						lang: userInfo.learningLang,
						query: debouncedSearchTerm.trim(),
					},
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
					withCredentials: true,
				})
				.then((res) => {
					setWords(res.data);
				})
				.catch((error) => {
					if (error.response) {
						console.log(error.response);
					}
				});
		}
	}, [debouncedSearchTerm]);

	useEffect(() => {
		//TO DO ломает логику первичной отрисовки слов при загрузке страницы
		setWords([]);
		setQuery("");

		if (!searchOpen) {
			setCardsType("builder");
			setShowSaveBtn(false);
			setWordsInTask([]);
		} else {
			setCardsType("search-builder");
		}
	}, [searchOpen]);

	const handleCardAddToTask = (word: WordsData) => {
		//check isset sdded word
		const currentWord = wordsInTask.find(
			(cWord: WordsData) => cWord.id === word.id
		);
		if (!currentWord) {
			setShowSaveBtn(true);
			setWordsInTask([...wordsInTask, word]);
		}
	};

	const handleCardRemoveFromTask = (word: WordsData) => {
		const newWords = wordsInTask.filter((cWord) => cWord.id != word.id);
		setWordsInTask(newWords);
	};

	useEffect(() => {
		setIsSaved(false);
	}, [wordsInTask]);

	return (
		<>
			<Head>
				<title>Cabinet</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar taskQuantity={tasksQuantity} />
				<div className={styles.mainContainer}>
					<Header
						user={userInfo}
						searchOpen={searchOpen}
						setSearchOpen={setSearchOpen}
						setQuery={setQuery}
						query={query}
					/>
					{!searchOpen && (
						<FilterBuilder
							topics={topics}
							levels={levels}
							btnSubmitFormClick={handleFormSubmit}
							btnSubmitSaveWords={handleSaveWords}
							loader={loader}
							saveBtnLoader={saveBtnLoader}
							showSaveBtn={showSaveBtn}
							isSaved={isSaved}
						/>
					)}

					{words.length > 0 && (
						<WordsContainer
							type={cardsType}
							words={words}
							user={user}
							userInfo={userInfo}
							handleCardAddToTask={handleCardAddToTask}
						/>
					)}

					{searchOpen && wordsInTask.length > 0 && (
						<SearchWordsBuilder
							handleCardRemoveFromTask={handleCardRemoveFromTask}
							wordsInTask={wordsInTask}
							loader={loader}
							saveBtnLoader={saveBtnLoader}
							showSaveBtn={showSaveBtn}
							isSaved={isSaved}
							btnSubmitSaveWords={handleSaveWordsFromSearch}
						/>
					)}
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let userInfo = null;
	let topics = null;
	let levels = null;
	let words = null;
	let tasks = null;

	if (token) {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (res.ok) {
			user = await res.json();
			user.token = token;
		}
	}

	if (!user) {
		return {
			redirect: {
				destination: "/auth/login",
				statusCode: 302,
			},
		};
	}

	//get user info
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (res.ok) {
		userInfo = await res.json();
	}

	//get topics
	const topicsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/topics`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (topicsRes.ok) {
		topics = await topicsRes.json();
	}

	//get levels
	const levelsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/levels`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (levelsRes.ok) {
		levels = await levelsRes.json();
	}

	//get words from filter
	const wordsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/words/filter?learningLang=${userInfo.learningLang}&topic_id=11&level_id=1&is_phrase=0&quantity=6`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (wordsRes.ok) {
		words = await wordsRes.json();
	}

	//get tasks by user
	const tasksRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${user.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (tasksRes.ok) {
		tasks = await tasksRes.json();
	}

	return {
		props: {
			user: user,
			userInfo: userInfo,
			topics: topics,
			levels: levels,
			loadWords: words,
			tasks: tasks,
		},
	};
};
