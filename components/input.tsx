interface Input {
  id: string;
  name: string;
  type: string;
  value?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loader?: boolean;
  placeholder?: string;
  autocomplete?: string;
  error?: boolean;
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
    error,
    checked,
  } = props;

  return (
    <>
      <input
        className={error ? "input-error" : ""}
        id={id}
        name={name}
        type={type}
        value={value}
        defaultChecked={checked}
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
