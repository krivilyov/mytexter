interface Input {
	id: string;
	name: string;
	type: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: Input) => {
	const { id, name, type, value, onChange, onBlur } = props;

	return (
		<>
			<input
				id={id}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</>
	);
};

export default Input;
