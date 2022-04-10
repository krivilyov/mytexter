import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { TasksData } from "../../interfaces/interfaces";

import styles from "../../styles/cabinet/Sidebar.module.scss";

interface SidebarProps {
  taskQuantity: number;
}

export default function Sidebar(props: SidebarProps) {
  const { taskQuantity } = props;

  const router = useRouter();
  const [show, isShow] = useState(true);

  return (
    <div className={`${styles.sidebar} ${show ? styles.activeSidebar : ""}`}>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarBtn} onClick={() => isShow(!show)}>
          <svg
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.4543 0.704102L0.159302 5.99985L5.4543 11.2956L7.0458 9.7041L3.3408 5.99985L7.0458 2.2956L5.4543 0.704102Z"
              fill="#52AFFC"
            />
          </svg>
        </div>
        <div className={styles.sidebarWrapper}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <a className={styles.logoLink}>
                <Image
                  src="/images/logo.svg"
                  alt="My Texter logo"
                  width={200}
                  height={70}
                />
              </a>
            </Link>
          </div>
          <div className={styles.menuContainer}>
            <div className={styles.menuTitle}>Main Menu</div>
            <ul className={styles.nav}>
              <li
                className={
                  router.pathname.indexOf("task-builder") !== -1
                    ? styles.menuLinkActive
                    : ""
                }
              >
                <Link href="/cabinet/task-builder">
                  <a className={styles.menuLink}>
                    <AssignmentIcon />
                    Task Builder
                  </a>
                </Link>
              </li>
              <li
                className={
                  router.pathname.indexOf("progress") !== -1
                    ? styles.menuLinkActive
                    : ""
                }
              >
                <Link href="/cabinet/progress">
                  <a className={styles.menuLink}>
                    <AssessmentIcon />
                    Your Progress
                    <span className={styles.progress}>{taskQuantity}</span>
                  </a>
                </Link>
              </li>
            </ul>

            <div className={styles.menuTitle}>General</div>
            <ul className={styles.nav}>
              <li>
                <Link href="/">
                  <a className={styles.menuLink}>
                    <SettingsIcon />
                    Settings
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className={styles.menuLink}>
                    <HelpCenterIcon />
                    Help
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className={styles.menuLink}>
                    <LogoutIcon />
                    Log out
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
