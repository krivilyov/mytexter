interface Input {
	id: string;
	name: string;
	type: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	loader?: boolean;
	placeholder?: string;
	autocomplete?: string;
}

const Input = (props: Input) => {
	const {
		id,
		name,
		type,
		value,
		onChange,
		onBlur,
		loader,
		placeholder,
		autocomplete,
	} = props;

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
				placeholder={placeholder}
				autoComplete={autocomplete}
			/>
		</>
	);
};

export default Input;
