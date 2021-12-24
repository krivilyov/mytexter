import { useRouter } from "next/router";
import { useEffect } from "react";

const CustomRedirect = ({ to }) => {
	const router = useRouter();

	useEffect(() => {
		router.push(to);
	}, [to]);

	return null;
};

export default CustomRedirect;
