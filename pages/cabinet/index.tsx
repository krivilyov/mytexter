import { GetServerSideProps } from "next";
import { UserDocument } from "../../interfaces/interfaces";
import Head from "next/head";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";

import styles from "../../styles/cabinet/Cabinet.module.scss";

interface CabinetProps {
  user: UserDocument;
}

export default function Cabinet(props: CabinetProps) {
  const { user } = props;
  return (
    <>
      <Head>
        <title>Cabinet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContainer}>
          <Header />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token || "";
  let user = null;

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

  return {
    props: {
      user: user,
    },
  };
};
