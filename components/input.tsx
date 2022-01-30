interface Input {
	id: string;
	name: string;
	type: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	loader?: boolean;
}

const Input = (props: Input) => {
	const { id, name, type, value, onChange, onBlur, loader } = props;

	return (
		<>
			<input
				id={id}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				disabled={loader ? true : false}
			/>
		</>
	);
};

export default Input;
