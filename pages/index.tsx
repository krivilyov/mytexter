import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSideProps } from "next";

interface UserDocument {
	id: string;
	email: string;
	role: string;
	iat: number;
	exp: number;
}

interface HomeProps {
	user?: UserDocument;
}

const Home: NextPage<HomeProps> = (props) => {
	const { user } = props;

	return (
		<div>
			<h1>Index UserToken {user?.email}</h1>
		</div>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const token = req.cookies.token || "";
	let user = null;

	if (token) {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.ok) {
			user = await res.json();
		}
	}

	return {
		props: {
			user: user,
		},
	};
};
