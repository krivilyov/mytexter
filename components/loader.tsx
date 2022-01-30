import Image from "next/image";

type LoaderProps = {
	image: string;
};

export default function Loader(props: LoaderProps) {
	const { image } = props;

	return <Image src={image} alt="My Texter loader" height={50} width={50} />;
}
