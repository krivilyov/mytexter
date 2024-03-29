import Link from "next/link";
import styles from "../../styles/admin/Sidebar.module.scss";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SchoolIcon from "@mui/icons-material/School";
import TopicIcon from "@mui/icons-material/Topic";
import LanguageIcon from "@mui/icons-material/Language";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import EmailIcon from "@mui/icons-material/Email";
import { UserDocument } from "../../interfaces/interfaces";
import React from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface SidebarProps {
	user: UserDocument;
}

const Sidebar = (props: SidebarProps) => {
	const { user } = props;

	const router = useRouter();

	const handleLogaut = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
				{},
				{
					withCredentials: true,
				}
			)
			.then((res) => router.push("/"))
			.catch((error) => {
				if (error.response) {
					console.log(error.response);
				}
			});
	};

	return (
		<div className={styles.sidebar}>
			<div className={styles.sidebarWrapper}>
				<div className={styles.title}>
					<Link href="/">
						<a>MyTexter</a>
					</Link>
					<span>adminpanel</span>
				</div>
				<div className={styles.userInfo}>
					<a href="#" onClick={handleLogaut} className={styles.userName}>
						<span>{user.name}</span>
						<ExitToAppIcon />
					</a>
				</div>
				<div className={styles.hr}></div>
				<ul className={styles.saidebarList}>
					<li
						className={`${styles.saidebarListItem} ${
							router.pathname.indexOf("user") !== -1 ? styles.active : ""
						}`}
					>
						<Link href="/admin/users">
							<a>
								<ManageAccountsIcon />
								Users
							</a>
						</Link>
					</li>
					<li
						className={`${styles.saidebarListItem} ${
							router.pathname.indexOf("language") !== -1 ? styles.active : ""
						}`}
					>
						<Link href="/admin/languages">
							<a>
								<LanguageIcon />
								Languages
							</a>
						</Link>
					</li>
					<li
						className={`${styles.saidebarListItem} ${
							router.pathname.indexOf("topic") !== -1 ? styles.active : ""
						}`}
					>
						<Link href="/admin/topics">
							<a>
								<TopicIcon />
								Topics
							</a>
						</Link>
					</li>
					<li
						className={`${styles.saidebarListItem} ${
							router.pathname.indexOf("level") !== -1 ? styles.active : ""
						}`}
					>
						<Link href="/admin/levels">
							<a>
								<SchoolIcon />
								Language levels
							</a>
						</Link>
					</li>
					<li
						className={`${styles.saidebarListItem} ${
							router.pathname.indexOf("word") !== -1 ? styles.active : ""
						}`}
					>
						<Link href="/admin/words">
							<a>
								<ChromeReaderModeIcon />
								Words
							</a>
						</Link>
					</li>
					<li
						className={`${styles.saidebarListItem} ${
							router.pathname.indexOf("subscriptions") !== -1
								? styles.active
								: ""
						}`}
					>
						<Link href="/admin/subscriptions">
							<a>
								<EmailIcon />
								Subscriptions
							</a>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
