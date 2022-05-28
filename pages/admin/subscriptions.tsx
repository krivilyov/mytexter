import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import { GetServerSideProps } from "next";
import { UserDocument } from "../../interfaces/interfaces";
import SubscriptionsList from "../../components/admin/subscriptions/SubscriptionsList";
import { SubscriptionsData } from "../../interfaces/interfaces";

import styles from "../../styles/admin/PageWithList.module.scss";

interface SubscriptionsProps {
	user: UserDocument;
	subscriptions: SubscriptionsData[];
}

export default function Subscriptions(props: SubscriptionsProps) {
	const { user, subscriptions } = props;

	return (
		<>
			<Head>
				<title>Subscriptions</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className={styles.container}>
				<Sidebar user={user} />
				<div className={styles.rightColumn}>
					<SubscriptionsList subscriptions={subscriptions} />
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token || "";
	let user = null;
	let subscriptions = [];

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

	//get subscriptions
	const subscriptionsRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);

	if (subscriptionsRes.ok) {
		subscriptions = await subscriptionsRes.json();
	}

	return {
		props: {
			user: user,
			subscriptions: subscriptions,
		},
	};
};
