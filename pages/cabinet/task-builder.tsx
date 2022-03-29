import { GetServerSideProps } from "next";
import {
  UserDocument,
  TopicsData,
  LevelsData,
  WordsData,
} from "../../interfaces/interfaces";
import Head from "next/head";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";
import FilterBuilder from "../../components/cabinet/FilterBuilder";
import WordsContainer from "../../components/cabinet/WordsContainer";
import { useState } from "react";
import axios from "axios";

import styles from "../../styles/cabinet/Cabinet.module.scss";

interface TaskBuilderProps {
  user: UserDocument;
  userInfo: UserDocument;
  topics: TopicsData[];
  levels: LevelsData[];
  loadWords: WordsData[];
}

export default function TaskBuilder(props: TaskBuilderProps) {
  const { user, userInfo, topics, levels, loadWords } = props;

  const [words, setWords] = useState(loadWords);
  const [loader, isLoader] = useState(false);

  interface FilterValuesProps {
    quantity: string;
    phrase: string;
    level_id: string;
    topic_id: number;
    save: string;
  }

  const handleFormSubmit = (filterValues: FilterValuesProps) => {
    isLoader(!loader);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/words/filter?language_id=1&topic_id=${filterValues.topic_id}&level_id=${filterValues.level_id}&is_phrase=${filterValues.phrase}&quantity=${filterValues.quantity}`,
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
      })
      .catch((error) => {
        if (error.response) {
          isLoader(false);
          console.log(error.response);
        }
      });
  };

  return (
    <>
      <Head>
        <title>Cabinet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContainer}>
          <Header user={userInfo} />
          <FilterBuilder
            topics={topics}
            levels={levels}
            btnSubmitFormClick={handleFormSubmit}
            loader={loader}
          />
          {words.length > 0 && <WordsContainer words={words} />}
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

  if (!user || user.role !== "admin") {
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/words/filter?language_id=1&topic_id=1&level_id=1&is_phrase=1&quantity=6`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (wordsRes.ok) {
    words = await wordsRes.json();
  }

  return {
    props: {
      user: user,
      userInfo: userInfo,
      topics: topics,
      levels: levels,
      loadWords: words,
    },
  };
};
