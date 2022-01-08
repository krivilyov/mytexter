import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../../components/admin/Sidebar";
import { UserDocument, LevelsData } from "../../../interfaces/interfaces";
import styles from "../../../styles/admin/UpdateForm.module.scss";
import LevelUpdateForm from "../../../components/admin/level/LevelUpdateForm";
import { GetServerSideProps } from "next";

interface LevelUpdateProps {
	user: UserDocument;
	level: LevelsData;
}

const LevelUpdate: NextPage<LevelUpdateProps> = (props) => {
	const { user, level } = props;

	return (
		<>
			<Head>
				<title>Update topic - {level.title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<div className={styles.wrapper}>
						<h1>Topic - "{level.title}"</h1>
						<LevelUpdateForm user={user} level={level} />
					</div>
				</div>
			</div>
		</>
	);
};

export default LevelUpdate;

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const token = req.cookies.token || "";
	let user = null;
	let level = null;

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
				destination: "/login",
				statusCode: 302,
			},
		};
	}

	//get level
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/level/${query.id}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (res.ok) {
		level = await res.json();
	}

	return {
		props: {
			user: user,
			level: level,
		},
	};
};
