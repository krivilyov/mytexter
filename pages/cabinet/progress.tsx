import Head from "next/head";
import { GetServerSideProps } from "next";
import Sidebar from "../../components/cabinet/Sidebar";
import Header from "../../components/cabinet/Header";
import { UserDocument, TasksData } from "../../interfaces/interfaces";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";

import styles from "../../styles/cabinet/ProgressPage.module.scss";

interface ProgressProps {
  user: UserDocument;
  userInfo: UserDocument;
  tasks: TasksData[];
}

export default function Progress(props: ProgressProps) {
  const { userInfo, tasks } = props;

  return (
    <>
      <Head>
        <title>Progress</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.container}>
        <Sidebar taskQuantity={tasks.length} />
        <div className={styles.mainContainer}>
          <Header user={userInfo} />
          <div className={styles.progressContainer}>
            {tasks.length ? (
              <>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCol_1}>Tasks</div>
                  <div className={styles.tableCol_2}>Execution time</div>
                  <div className={styles.tableCol_3}>Status</div>
                  <div className={styles.tableCol_4}>Delete</div>
                </div>
                <div className={styles.tableBody}>
                  {tasks.map((task, index) => (
                    <Link href={`/cabinet/task/${task.id}`} key={index}>
                      <a
                        className={`${styles.tableRow} ${
                          (index + 1) % 2 !== 0 ? styles.tableRowWhite : ""
                        }`}
                      >
                        <div className={styles.tableCol_1}>
                          Task number {task.id}
                        </div>
                        <div className={styles.tableCol_2}>
                          <AccessTimeIcon />
                        </div>
                        <div className={styles.tableCol_3}>
                          {task.status ? (
                            <div className={styles.checkCircleOutlineIcon}>
                              <CheckCircleOutlineIcon />
                            </div>
                          ) : (
                            "prog"
                          )}
                        </div>
                        <div className={styles.tableCol_4}>
                          <DeleteOutlineIcon />
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div>You dont have tasks</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token || "";
  let user = null;
  let userInfo = null;
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

  //get tasks by user
  const tasksRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${user.id}?order=DESC`,
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
      tasks: tasks,
    },
  };
};
