import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface UserDocument {
	id: string;
	email: string;
	token: string;
}

interface UserContext {
	user?: UserDocument;
}

export const UserContext = createContext<UserContext>(null!);

function MyApp({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState();

	useEffect(() => {
		const cookieToken = Cookies.get("token");

		if (cookieToken) {
			//check user
			axios
				.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
					headers: { Authorization: `Bearer ${cookieToken}` },
				})
				.then((res) => {
					console.log(res.data);
					if (res.data) {
						setUser(res.data);
					}
				})
				.catch((err) => console.error(err));
		}
	}, []);

	return (
		<UserContext.Provider
			value={{
				user: user,
			}}
		>
			<Component {...pageProps} />
		</UserContext.Provider>
	);
}

export default MyApp;
