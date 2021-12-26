import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../components/admin/Sidebar";
import styles from "../../styles/admin/Admin.module.scss";

const AdminMain: NextPage = () => {
	return (
		<>
			<Head>
				<title>Admin panel</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className={styles.container}>
				<Sidebar />
			</div>
		</>
	);
};

export default AdminMain;
