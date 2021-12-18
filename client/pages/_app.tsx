import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";

interface UserDocument {
	id: string;
	name: string;
	token: string;
}

interface UserContext {
	user?: UserDocument;
}

export const UserContext = createContext<UserContext>(null!);

function MyApp({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState();

	// get the token from the cookie
	const cookieToken = Cookies.get("token");

	if (cookieToken) {
		//check user
	}

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
