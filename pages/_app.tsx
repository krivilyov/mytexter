import "../styles/globals.css";
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
		// get the token from the cookie
		Cookies.set(
			"token",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJYRUdPQHlhbmRleC5ydSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYzOTg1NTM2NSwiZXhwIjoxNjM5ODk4NTY1fQ.79wUvmxeqAe5_nBbxzcIoRCfG6WepGgn-h5wLFXGRo4"
		);
		const cookieToken = Cookies.get("token");
		console.log(cookieToken);
		if (cookieToken) {
			//check user
			axios
				.get(`http://localhost:8000/api/auth/profile`, {
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
