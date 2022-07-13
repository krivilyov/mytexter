import Image from "next/image";
import { UserDocument } from "../../interfaces/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import Input from "../input";
import { useState, useRef, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "../../styles/cabinet/Header.module.scss";

interface HeaderProps {
	user: UserDocument;
	searchOpen: boolean;
	setSearchOpen?: (type: boolean) => void;
	setQuery?: (type: string) => void;
	query?: string;
}

export default function Header(props: HeaderProps) {
	const { user, setSearchOpen, searchOpen, setQuery, query } = props;
	const router = useRouter();
	const refSearch = useRef<HTMLDivElement>(null);

	return (
		<div className={styles.header}>
			<div className={styles.userInfo}>
				<div className={styles.avatar}>
					<Image
						src={
							user.avatar
								? `${process.env.NEXT_PUBLIC_API_URL}/${user.avatar}`
								: "/images/empty_avatar.jpg"
						}
						alt="Avatar logo"
						width={80}
						height={80}
					/>
				</div>
				<div className={styles.userDescription}>
					<div className={styles.userName}>{user.name}</div>
				</div>
			</div>
			{router.pathname.indexOf("task-builder") !== -1 && (
				<div className={styles.searchContainer} ref={refSearch}>
					{searchOpen ? (
						<div className={styles.searchWrap}>
							<Input
								id="search"
								name="search"
								type="text"
								onChange={(e) => {
									typeof setQuery !== "undefined"
										? setQuery(e.target.value)
										: {};
								}}
								value={query}
								placeholder={"Search..."}
							/>
							<div className={styles.searchCross}>
								<ClearIcon
									onClick={() => {
										typeof setSearchOpen !== "undefined"
											? setSearchOpen(!searchOpen)
											: {};
									}}
								/>
							</div>
						</div>
					) : (
						<SearchIcon
							onClick={() => {
								typeof setSearchOpen !== "undefined"
									? setSearchOpen(!searchOpen)
									: {};
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
}
