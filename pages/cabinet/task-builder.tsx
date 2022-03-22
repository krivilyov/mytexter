import { GetServerSideProps } from "next";
import {
  UserDocument,
  TopicsData,
  LevelsData,
} from "../../interfaces/interfaces";
import Head from "next/head";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";
import FilterBuilder from "../../components/cabinet/FilterBuilder";

import styles from "../../styles/cabinet/Cabinet.module.scss";

interface TaskBuilderProps {
  user: UserDocument;
  topics: TopicsData[];
  levels: LevelsData[];
}

export default function TaskBuilder(props: TaskBuilderProps) {
  const { user, topics, levels } = props;

  interface FilterValuesProps {
    quantity: string;
    phrase: string;
    level_id: string;
    topic_id: number;
    save: string;
  }

  const handleFormSubmit = (filterValues: FilterValuesProps) => {
    console.log(filterValues);
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
          <Header user={user} />
          <FilterBuilder
            topics={topics}
            levels={levels}
            btnSubmitFormClick={handleFormSubmit}
          />
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

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      user = await res.json();
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

  return {
    props: {
      user: userInfo,
      topics: topics,
      levels: levels,
    },
  };
};
