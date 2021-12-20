import type { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import { UserContext } from "./_app";

const Home: NextPage = () => {
	const { user } = useContext(UserContext);

	return (
		<div>
			<h1>Index{user?.email}</h1>
		</div>
	);
};

export default Home;
